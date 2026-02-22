import { useEffect, useState } from "react";
import { categoryService } from "../../services/category.service";

interface Category {
  _id: string;
  name: string;
  description: string;
  logo_image: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi lấy category:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý danh mục</h2>

      <table border={1} cellPadding={10} width="100%">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên</th>
            <th>Mô tả</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>
                <img
                  src={cat.logo_image}
                  width={60}
                />
              </td>

              <td>{cat.name}</td>

              <td>{cat.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;