import "../styles/globals.css";
import NeuralCanvas from "../components/NeuralCanvas";

export const metadata = {
  title: "The Aprajita Archive",
  description: "The Aprajita Archive"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-midnight text-white min-h-screen">
        <NeuralCanvas />
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
