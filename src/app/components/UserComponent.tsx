import { User, UserRoundPen, Bell, LogOut } from 'lucide-react'

export function InfoProfileUser() {
  return (
    <div className="relative w-full flex justify-end items-center gap-5">
      <div className="relative cursor-pointer">
        <div>
          <User size={25} />
        </div>

        <div className="absolute top-full right-0 bg-white shadow-md rounded min-w-[150px] z-[1000] hidden">
          <div className="flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors hover:bg-gray-100">
            <UserRoundPen size={20} />
            Perfil
          </div>
          <div className="flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors hover:bg-gray-100">
            <LogOut size={20} />
            Sair
          </div>
        </div>
      </div>

      <div className="relative cursor-pointer">
        <div className="relative">
          <Bell size={25} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {/* unread count */}
          </span>
        </div>

        <div className="absolute top-full right-0 bg-white shadow-md rounded min-w-[150px] z-[1000] hidden">
          <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500">
            Nenhuma notificação
          </div>
          <div className="flex flex-col px-4 py-2 cursor-pointer transition-colors hover:bg-gray-100 text-sm opacity-100">
            <strong className="text-[14px] mb-1">Título da Notificação</strong>
            <p className="text-[13px] text-gray-600 m-0">Texto da notificação</p>
          </div>
        </div>
      </div>
    </div>

  )
}