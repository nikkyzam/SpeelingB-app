// Add this import at the top with other imports
import ReadingHub from './pages/ReadingHub';
import BookReader from './components/reading/BookReader';

// Add these routes inside your Router component (likely in the Switch or Routes component)
<Route path="/reading" element={<ReadingHub />} />
<Route path="/reading/book/:bookId" element={<BookReader />} />

// You might also want to add a link to the Reading Hub in your navigation
// Look for your navigation component and add something like:
// <Link to="/reading" className="nav-link">
//   📚 Reading Hub
// </Link>
