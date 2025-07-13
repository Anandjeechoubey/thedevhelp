import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="text-center p-8">
        <div className="flex flex-col items-center justify-center mb-6">
          <Image 
            src="/money_manger_assets/logo-800x800.png" 
            alt="Money Manager Logo" 
            width={120} 
            height={120} 
            className="rounded-md"
            priority
          />
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-6xl md:text-7xl">
          Money Manager
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 sm:text-xl md:text-2xl">
          Your personal finance, simplified.
        </p>
        <p className="max-w-2xl mx-auto mt-2 text-base text-gray-500 dark:text-gray-400">
          Track your daily expenses, categorize your spending, and take control of your financial future with an easy-to-use interface.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/login"
            className="px-8 py-3 text-base font-medium text-white bg-indigo-600 dark:bg-indigo-700 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 text-base font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 border border-transparent rounded-md shadow-sm hover:bg-indigo-200 dark:hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
