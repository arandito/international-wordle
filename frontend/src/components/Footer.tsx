import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="flex max-w-4xl w-full items-center px-10 py-5 border-t border-border border-gray-500">
      <div className="flex items-center">
        <span className='text-gray-500'>built by <Link href="https://github.com/arandito" className='underline underline-offset-2 hover:text-white'>arandito.</Link></span>
      </div>
    </footer>
  );
};

export default Footer;