import { CommandPalette } from "@/components/ui/command-palette";
import Keyboard from "@/components/ui/magic-keyboard-component";

export default function CommandDemo() {
  return (
    <div className="flex flex-col items-center gap-12 py-12">
      <CommandPalette />
      
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-serif text-hf-text-primary">Interactive Keyboard Layer</h2>
        <Keyboard />
      </div>
    </div>
  );
}
