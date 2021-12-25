import { useState } from 'react';
import { useHeadingsData, useIntersectionObserver } from '../../hooks/headings';
import Headings from '../Headings/Headings';
import './TableOfContents.css';

const TableOfContents = () => {
  const [activeId, setActiveId] = useState()
  const { nestedHeadings } = useHeadingsData();
  useIntersectionObserver(setActiveId);

  return (
    <nav aria-label="Table of contents">
      <Headings headings={nestedHeadings} activeId={activeId} />
    </nav>
  )
}

export default TableOfContents;