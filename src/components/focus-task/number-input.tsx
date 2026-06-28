import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

type NumberInputProps = {
  onIncrease: () => void;
  onDecrease: () => void;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export default function NumberInput({
  onIncrease,
  onDecrease,
  ...props
}: NumberInputProps) {
  return (
    <div className="flex gap-1">
      <Button type="button" variant={"outline"} onClick={() => onDecrease()}>
        <Minus />
      </Button>
      <Input className="text-right" {...props} />
      <Button type="button" variant={"outline"} onClick={() => onIncrease()}>
        <Plus />
      </Button>
    </div>
  );
}
