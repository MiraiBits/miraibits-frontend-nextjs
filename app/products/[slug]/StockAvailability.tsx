interface StockAvailabilityProps {
  stock: number;
}

export default function StockAvailability({ stock }: StockAvailabilityProps) {
  return (
    <div className="mt-4">
      {
        stock > 0 ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            In Stock ({stock} available)
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            Out of Stock
          </span>
        )
      }
    </div>
  );
}
