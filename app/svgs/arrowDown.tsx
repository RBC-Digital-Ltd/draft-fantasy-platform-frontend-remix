interface Props {
  colour?: string;
}

export default function ArrowDown({ colour }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon"
      width={16}
      height={10}
      viewBox="0 0 16 10"
      fill={colour || "currentColor"}
    >
      <path d="M8 10L0 2.49956L2.66792 0L8 5.00088L13.3321 0L16 2.49956L8 10Z" />
    </svg>
  );
}
