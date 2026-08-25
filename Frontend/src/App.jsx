import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import AllCaseStudies from './pages/CaseStudies/AllCaseStudies';
import CaseStudyDetail from './pages/CaseStudies/CaseStudyDetail';
import AllServices from './pages/Services/AllServices';
import ServiceDetail from './pages/Services/ServiceDetail';
import AllBooks from './pages/SpecialBooks/AllBooks';
import BookDetail from './pages/SpecialBooks/BookDetail';
import ShowAllBooks from './pages/SpecialBooks/ShowAllBooks';
import About from './pages/About';
import AllProjects from './pages/Work/AllProjects';
import PlaceholderPage from './components/PlaceholderPage';
import './App.css';

// Import Dummy Data
import { servicesData, projectsData, caseStudiesData, booksData } from './data/dummyData';

import AdminLayout from './pages/Admin/AdminLayout';
import AdminBooks from './pages/Admin/AdminBooks';
import BookForm from './pages/Admin/BookForm';
import AdminWorks from './pages/Admin/AdminWorks';
import WorkForm from './pages/Admin/WorkForm';

// Dynamic wrappers to extract URL params for boilerplate titles
const WorkCategory = () => {
  const { category } = useParams();
  const categoryData = projectsData.filter(p => p.category === category);
  return <PlaceholderPage title={`Work: ${category.replace('-', ' ')}`} data={categoryData} />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          
          <Route path="work" element={<AllProjects />} />
          <Route path="work/:category" element={<WorkCategory />} />
          
          <Route path="services" element={<AllServices />} />
          <Route path="services/:serviceId" element={<ServiceDetail />} />
          
          <Route path="case-studies" element={<AllCaseStudies />} />
          <Route path="case-studies/:id" element={<CaseStudyDetail />} />
          
          <Route path="special-books" element={<AllBooks />} />
          <Route path="special-books/all" element={<ShowAllBooks />} />
          <Route path="special-books/:id" element={<BookDetail />} />
          
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="books" element={<AdminBooks />} />
          <Route path="books/new" element={<BookForm />} />
          <Route path="books/edit/:id" element={<BookForm />} />
          <Route path="works" element={<AdminWorks />} />
          <Route path="works/new" element={<WorkForm />} />
          <Route path="works/edit/:id" element={<WorkForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
