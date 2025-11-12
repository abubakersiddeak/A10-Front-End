export default function Card({ title, description, imageUrl, footer }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="h-40 w-full object-cover" />
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm text-gray-700">{description}</p>
        {footer && <div className="mt-2">{footer}</div>}
      </div>
    </div>
  );
}
