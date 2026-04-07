import { useState, useCallback } from 'react'

export function useConfirm() {
  const [confirmState, setConfirmState] = useState(null)

  const confirm = useCallback(({ title, message, onConfirm }) => {
    setConfirmState({ title, message, onConfirm })
  }, [])

  const ConfirmDialog = useCallback(() => {
    if (!confirmState) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black/50" 
          onClick={() => setConfirmState(null)}
        />
        <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {confirmState.title}
          </h3>
          <p className="text-gray-600 mb-6">
            {confirmState.message}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmState(null)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                confirmState.onConfirm()
                setConfirmState(null)
              }}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    )
  }, [confirmState])

  return { confirm, ConfirmDialog }
}
