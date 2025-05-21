'use client';

type Props = {
  totalCredits: number | null;
};

export function Navbar({ totalCredits }: Props) {
  return (
    <nav className="w-full bg-gray-800 text-white px-4 py-3 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">🎰 Slot Machine</h1>
        <div className="text-sm font-medium">
          💼 My Credits: <span className="text-green-400">{totalCredits ? totalCredits : 0}</span>
        </div>
    </nav>
  );
}
