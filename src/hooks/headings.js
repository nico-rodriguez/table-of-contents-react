import { useEffect, useRef, useState } from "react";

export const useHeadingsData = () => {
  const [nestedHeadings, setNestedHeadings] = useState([]);

  useEffect(() => {
    const headingElements = Array.from(document.querySelectorAll("h2, h3"));
    const newNestedHeadings = getNestedHeadings(headingElements);

    setNestedHeadings(newNestedHeadings);
  }, []);

  return { nestedHeadings };
}

const getNestedHeadings = (headingElements) => {
  const nestedHeadings = [];

  headingElements.forEach((heading, index) => {
    const { innerText: title, id } = heading;

    if (heading.nodeName === "H2") {
      nestedHeadings.push({ id, title, items: [] });
    } else if (heading.nodeName === "H3" &&  nestedHeadings.length > 0) {
      nestedHeadings[nestedHeadings.length - 1].items.push({ id, title });
    }
  })

  return nestedHeadings;
}

export const useIntersectionObserver = (setActiveId) => {
  const headingElementsRef = useRef({});

  useEffect(() => {
    const callback = (headings) => {
      headingElementsRef.current = headings.reduce((map, headingElement) => {
        map[headingElement.target.id] = headingElement;
        return map;
      }, headingElementsRef.current);

      const visibleHeadings = [];
      Object.keys(headingElementsRef.current).forEach((key) => {
        const headingElement = headingElementsRef.current[key];
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
      });
  
      const getIndexFromId = (id) => {
        headingElements.findIndex((heading) => heading.id === id);
      };

      if (visibleHeadings.length > 0) {
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => getIndexFromId(a.target.id) > getIndexFromId(b.target.id)
        );
        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    });
    const headingElements = Array.from(document.querySelectorAll("h2, h3"));
    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [setActiveId])
}