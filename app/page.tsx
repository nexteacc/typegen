
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full w-full">
      <div className="relative w-[500px]">
        {/* 输入框容器 */}
        <div className="w-full h-[200px] custom-dash bg-transparent flex items-center justify-center p-4">
          <Input 
            placeholder="paste text here" 
            className="w-full h-full border-none bg-transparent text-center center-placeholder-textarea"
          />
        </div>
      </div>
    </div>
  );
}
