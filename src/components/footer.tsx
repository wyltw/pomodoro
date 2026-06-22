import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-muted-foreground mt-auto px-4 py-2 text-center">
      <small>
        © 2026 Pomodoro. All rights reserved. By
        <Link
          className="font-bold hover:text-black hover:underline"
          href={"https://github.com/wyltw"}
        >
          {" "}
          wyltw
        </Link>
      </small>
    </footer>
  );
}
