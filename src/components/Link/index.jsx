export default function Link({ href, children, className, id }) {
  return (
    <a className={className} id={id} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}