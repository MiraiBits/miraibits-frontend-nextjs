import type { Product } from '../../../lib/types';

export default function ProductSpecifications({ product }: { product: Product }) {
  if (!product.specifications) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Specifications</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <tbody>
            {Object.entries(product.specifications).map(([key, value]) => (
              <tr key={key} className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 pr-4 font-medium text-gray-900 dark:text-gray-100">{key}</td>
                <td className="py-2 text-gray-700 dark:text-gray-300">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
