import { ArrowLeft, ArrowDown, ArrowUp, ArrowRight } from 'lucide-react';

function Keyboard() {
  return (
    <div className="flex flex-col gap-1 p-5 rounded-xl bg-gray-300 shadow-md w-[600px] select-none text-gray-800 border-[1px] border-gray-400">
      {/* Row 1 - Function keys */}
      <div className="flex gap-0.5">
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-1 px-1 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 max-h-[25px]">esc</div>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((f) => (
          <div key={`F${f}`} className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-1 px-1 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 max-h-[25px]">F{f}</div>
        ))}
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-1 px-5 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 ml-4">⏏</div>
      </div>

      {/* Row 2 */}
      <div className="flex gap-0.5">
        {['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='].map((key) => (
          <div key={key} className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">{key}</div>
        ))}
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-5 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">delete</div>
      </div>

      {/* Row 3 */}
      <div className="flex gap-0.5">
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 flex-[2]">tab</div>
        {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'].map((key) => (
          <div key={key} className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">{key}</div>
        ))}
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 flex-[2]">\</div>
      </div>

      {/* Row 4 */}
      <div className="flex gap-0.5">
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 flex-[2]">caps lock</div>
        {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"].map((key) => (
          <div key={key} className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">{key}</div>
        ))}
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 flex-[2]">return</div>
      </div>

      {/* Row 5 */}
      <div className="flex gap-0.5">
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 flex-[3]">shift</div>
        {['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'].map((key) => (
          <div key={key} className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">{key}</div>
        ))}
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 flex-[3]">shift</div>
      </div>

      {/* Row 6 */}
      <div className="flex gap-0.5">
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">fn</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center py-2 px-1 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">ctrl</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center p-0.5 text-base cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">⌥</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center p-0.5 text-base cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">⌘</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[175px] text-center py-2 px-1 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 flex-[5]"></div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center p-0.5 text-base cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">⌘</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[35px] text-center p-0.5 text-base cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5">⌥</div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[30px] text-center py-2 px-1 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-center"><ArrowLeft size={16} /></div>
        <div className="flex flex-col gap-0.5">
          <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[30px] text-center py-0 px-2 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-center h-1/2 min-h-[14px]"><ArrowUp size={12} /></div>
          <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[30px] text-center py-0 px-2 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-center h-1/2 min-h-[14px]"><ArrowDown size={12} /></div>
        </div>
        <div className="bg-gray-100 border border-gray-400 rounded-md shadow-sm min-w-[30px] text-center py-2 px-1 text-xs cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-center"><ArrowRight size={16} /></div>
      </div>
    </div>
  );
}

export default Keyboard;
