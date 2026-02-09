import { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboard.service";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.getStats();
        setStats(res.data);
      } catch (error) {
        console.error("Lỗi lấy dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1>Dashboard</h1>

      <ul>
        <li>Tổng sản phẩm: {stats.products.total}</li>
        <li>Thương hiệu: {stats.brands.total}</li>
        <li>Danh mục: {stats.categories.total}</li>
        <li>Voucher: {stats.vouchers.total}</li>
        <li>Tin tức: {stats.news.total}</li>
        <li>Liên hệ: {stats.contacts.total}</li>
      </ul>
    </div>
  );
};

export default Dashboard;
