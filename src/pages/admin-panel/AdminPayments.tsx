// FileName: AdminPayments.tsx
// Path: src/pages/admin-panel/AdminPayments.tsx

import React, { useState, useEffect, useMemo } from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ArrowDownOnSquareIcon,
} from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";

// ===== API REAL =====
import { getAdminSubscriptionsSummary } from "../../services/api/admin";

type TransactionStatus = "Pagado" | "Pendiente" | "Fallido";

interface Transaction {
  id: string;
  storeName: string;
  amount: number;
  commission: number;
  date: string;
  status: TransactionStatus;
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-48">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="p-4 text-center text-red-600 bg-red-100 rounded-lg">
    {message}
  </div>
);

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) => (
  <Card className="shadow-sm">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-secondary rounded-full">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-text-muted mb-0">{title}</p>
        <p className="text-3xl font-bold text-text-main mt-1">{value}</p>
      </div>
    </div>
  </Card>
);

const StatusBadge = ({ status }: { status: TransactionStatus }) => {
  const styles: Record<TransactionStatus, string> = {
    Pagado: "bg-green-100 text-green-700",
    Pendiente: "bg-yellow-100 text-yellow-800",
    Fallido: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const AdminPaymentsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] =
    useState<TransactionStatus | "Todos">("Todos");

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // ======================================================
  // 🚀 Cargar datos DESDE EL BACKEND REAL
  // ======================================================
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getAdminSubscriptionsSummary();

        const mapped: Transaction[] = response.items.map((t: any) => ({
          id: t.transaction_id,
          storeName: t.store_name,
          amount: Number(t.amount),
          commission: Number(t.commission),
          date: t.date.split("T")[0], // para filtros por fecha
          status: t.status as TransactionStatus,
        }));

        setTransactions(mapped);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar historial de suscripciones."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // ======================================================
  // 🔍 Filtrado
  // ======================================================
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => (filterStatus === "Todos" ? true : t.status === filterStatus))
      .filter((t) => (!dateFrom ? true : t.date >= dateFrom))
      .filter((t) => (!dateTo ? true : t.date <= dateTo));
  }, [transactions, filterStatus, dateFrom, dateTo]);

  // ======================================================
  // 📊 Estadísticas
  // ======================================================
  const totalRecaudado = filteredTransactions.reduce(
    (acc, t) => (t.status === "Pagado" ? acc + t.amount : acc),
    0
  );

  const comisionesGanadas = filteredTransactions.reduce(
    (acc, t) => (t.status === "Pagado" ? acc + t.commission : acc),
    0
  );

  const tasaExito =
    filteredTransactions.length > 0
      ? (filteredTransactions.filter((t) => t.status === "Pagado").length /
          filteredTransactions.length) *
        100
      : 100;

  // ======================================================
  // 📄 Paginación
  // ======================================================
  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const handleExport = () =>
    toast("Función disponible en modo Tienda", { icon: "ℹ️" });

  // ======================================================
  // 🧱 Tabla UI
  // ======================================================
  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-text-main">
              <tr>
                <th className="p-4 font-semibold">ID Transacción</th>
                <th className="p-4 font-semibold">Tienda</th>
                <th className="p-4 font-semibold">Monto Total</th>
                <th className="p-4 font-semibold">Comisión</th>
                <th className="p-4 font-semibold">Fecha</th>
                <th className="p-4 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-t border-line-light hover:bg-secondary-light"
                >
                  <td className="p-4 font-mono text-text-muted text-xs">
                    {tx.id}
                  </td>
                  <td className="p-4 font-medium text-text-main">
                    {tx.storeName}
                  </td>
                  <td className="p-4 text-text-muted">
                    ${tx.amount.toLocaleString("es-MX")}
                  </td>
                  <td className="p-4 font-medium text-green-600">
                    ${tx.commission.toLocaleString("es-MX")}
                  </td>
                  <td className="p-4 text-text-muted">{tx.date}</td>
                  <td className="p-4">
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-line-light flex justify-between items-center text-xs text-text-muted">
          <span>
            Mostrando {indexOfFirst + 1}-{Math.min(indexOfLast, filteredTransactions.length)} de{" "}
            {filteredTransactions.length} transacciones
          </span>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <>
      <Toaster position="top-right" />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <StatCard
          title="Total Recaudado"
          value={`$${totalRecaudado.toLocaleString("es-MX", {
            minimumFractionDigits: 2,
          })}`}
          icon={BanknotesIcon}
        />

        <StatCard
          title="Comisiones Ganadas"
          value={`$${comisionesGanadas.toLocaleString("es-MX", {
            minimumFractionDigits: 2,
          })}`}
          icon={CurrencyDollarIcon}
        />

        <StatCard
          title="Tasa de Éxito"
          value={`${tasaExito.toFixed(0)}%`}
          icon={CheckCircleIcon}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex gap-2">
          <Input
            type="date"
            id="dateFrom"
            className="!py-1.5"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />

          <Input
            type="date"
            id="dateTo"
            className="!py-1.5"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />

          <select
            className="border border-line-light bg-surface rounded-lg px-2 py-2 text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="Todos">Todos</option>
            <option value="Pagado">Pagado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Fallido">Fallido</option>
          </select>
        </div>

        <Button variant="secondary" onClick={handleExport}>
          <ArrowDownOnSquareIcon className="w-4 h-4" /> Exportar Reporte
        </Button>
      </div>

      {renderContent()}
    </>
  );
};

export default AdminPaymentsPage;
