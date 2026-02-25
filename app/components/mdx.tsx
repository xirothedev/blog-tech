import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ))
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

// Standard markdown table elements with proper styling
function Td({ children }) {
  return <td className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">{children}</td>
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left font-semibold text-neutral-900 dark:text-neutral-100">{children}</th>
}

function Tr({ children }) {
  return <tr className="border-b border-neutral-200 dark:border-neutral-700 last:border-0">{children}</tr>
}

function Thead({ children }) {
  return <thead className="border-b border-neutral-300 dark:border-neutral-700">{children}</thead>
}

function Tbody({ children }) {
  return <tbody>{children}</tbody>
}

function TableWrapper({ children }) {
  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  )
}

function CustomLink(props) {
  let href = props.href

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />
}

function Code({ children, ...props }) {
  let codeHTML = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children)
    return React.createElement(
      "h" + level,
      { id: slug },
      [
        React.createElement('a', {
          href: "#" + slug,
          key: "link-" + slug,
          className: 'anchor',
        }),
      ],
      children
    )
  }

  Heading.displayName = "Heading" + level

  return Heading
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
  // Standard markdown table elements
  table: TableWrapper,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td,
}

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  )
}
