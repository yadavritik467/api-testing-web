import { Plus, X } from 'lucide-react'
import { useCollection } from '../context/Collection'

const Collection = () => {
  const { globalHeaders, setGlobalHeaders, environments, setEnvironments } =
    useCollection()

  // header logic
  const addGlobalHeader = () => {
    setGlobalHeaders((p) => [...p, { key: '', value: '', enabled: false }])
  }

  const removeGlobalHeader = (index: number) => {
    setGlobalHeaders((p) => p.filter((_: unknown, i: number) => i !== index))
  }

  const updateGlobalHeader = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    setGlobalHeaders((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  // environments logic
  const addEnvironments = () => {
    setEnvironments((p) => [...p, { key: '', value: '', enabled: false }])
  }

  const removeEnvironments = (index: number) => {
    setEnvironments((p) => p.filter((_: unknown, i: number) => i !== index))
  }

  const updateEnvironments = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    setEnvironments((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="my-6">
        <h3 className="text-xl font-bold text-gray-800">
          Set your Headers globally in your collection
        </h3>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="min-h-[200px]">
          <div className="border rounded-xl shadow-md p-6 space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pb-2 w-8"></th>
                    <th className="pb-2 px-2">Key</th>
                    <th className="pb-2 px-2">Value</th>
                    <th className="pb-2 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {globalHeaders.map((header, index) => (
                    <tr key={index} className="group">
                      <td className="py-1">
                        <input
                          type="checkbox"
                          checked={header.enabled}
                          onChange={(e) =>
                            updateGlobalHeader(
                              index,
                              'enabled',
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-1 px-2">
                        <input
                          type="text"
                          value={header.key}
                          onChange={(e) =>
                            updateGlobalHeader(index, 'key', e.target.value)
                          }
                          placeholder="Key"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-1 px-2">
                        <input
                          type="text"
                          value={String(header.value)}
                          onChange={(e) =>
                            updateGlobalHeader(index, 'value', e.target.value)
                          }
                          placeholder="Value"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-1">
                        <button
                          onClick={() => removeGlobalHeader(index)}
                          className="text-gray-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={addGlobalHeader}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Header
            </button>
          </div>
        </div>
      </div>

      <div className="my-6">
        <h3 className="text-xl font-bold text-gray-800">
          Set your environment variables globally in your collection
        </h3>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="min-h-[200px]">
          <div className="border rounded-xl shadow-md p-6 space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pb-2 w-8"></th>
                    <th className="pb-2 px-2">Key</th>
                    <th className="pb-2 px-2">Value</th>
                    <th className="pb-2 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {environments.map((e, index) => (
                    <tr key={index} className="group">
                      <td className="py-1">
                        <input
                          type="checkbox"
                          checked={e.enabled}
                          onChange={(e) =>
                            updateEnvironments(
                              index,
                              'enabled',
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-1 px-2">
                        <input
                          type="text"
                          value={e.key}
                          onChange={(e) =>
                            updateEnvironments(index, 'key', e.target.value)
                          }
                          placeholder="Key"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-1 px-2">
                        <input
                          type="text"
                          value={String(e.value)}
                          onChange={(e) =>
                            updateEnvironments(index, 'value', e.target.value)
                          }
                          placeholder="Value"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-1">
                        <button
                          onClick={() => removeEnvironments(index)}
                          className="text-gray-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={addEnvironments}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Environment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Collection
