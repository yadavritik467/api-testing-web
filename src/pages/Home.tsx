import { useEffect, useState } from "react";
import { Send, Plus, X } from "lucide-react";
import axios from "axios";

const Home = () => {
  const [method, setMethod] = useState("GET");
  const [baseUrl, setBaseUrl] = useState("https://dummyjson.com/products");
  const [finalUrl, setFinalUrl] = useState(baseUrl);
  const [activeTab, setActiveTab] = useState("params");
  const [params, setParams] = useState<
    { key: string; value: string; enabled: boolean }[]
  >([{ key: "", value: "", enabled: false }]);

  const [formattedHeaders, setFormattedHeaders] = useState<any>({});
  const [headers, setHeaders] = useState<
    { key: string; value: string; enabled: boolean }[]
  >([
    { key: "Content-Type", value: "application/json", enabled: true },
    {
      key: "Authorization",
      value:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0MDRmMTc4Yy04NGIyLTQxZGItODA3Ni03MThlY2Y3ODRiYzkiLCJuYW1lIjoicml0aWsgc2VydmljZWhpdmUiLCJ1c2VybmFtZSI6InlhZGF2cml0aWs0NDUiLCJpYXQiOjE3NjUyMDcyMjcsImV4cCI6MTc2NTI5MzYyN30.YRGy0g006-m4QfqpRK2FBuwIXGJyhiz9liXmO4dNxQg",
      enabled: true,
    },
  ]);
  const [body, setBody] = useState("");

  const [showResponse, setShowResponse] = useState<any>(null);

  const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

  const methodColors: { [key: string]: any } = {
    GET: "bg-green-500 hover:bg-green-600",
    POST: "bg-yellow-500 hover:bg-yellow-600",
    PUT: "bg-blue-500 hover:bg-blue-600",
    PATCH: "bg-purple-500 hover:bg-purple-600",
    DELETE: "bg-red-500 hover:bg-red-600",
  };

  const addParam = () => {
    setParams([...params, { key: "", value: "", enabled: true }]);
  };

  const removeParam = (index: number) => {
    setParams(params.filter((_, i) => i !== index));
  };

  const updateParam = (index: number, field: string, value: any) => {
    const newParams: any = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "", enabled: true }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: string, value: any) => {
    const newHeaders: any[] = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const generateParamsUrl = () => {
    const activeParams = params
      .filter((p) => p?.enabled && p.key.trim() !== "")
      .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join("&");

    return activeParams ? `${baseUrl}?${activeParams}` : baseUrl;
  };

  useEffect(() => {
    if (headers) {
      const formatHeaders = headers.reduce((acc, item) => {
        if (item?.enabled) acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, string>);
      setFormattedHeaders(formatHeaders);
    }
  }, [headers]);

  useEffect(() => {
    const updated = generateParamsUrl();
    setFinalUrl(updated);
  }, [params, baseUrl]);

  const GetMethod = async () => {
    try {
      const start = performance.now();
      const data = await axios.get(finalUrl, {
        headers: {
          "Content-Type": "application/json",
          ...formattedHeaders,
        },
      });
      const end = performance.now();
      const duration = end - start;
      setShowResponse({ ...data, time: Math.round(duration) });
    } catch (error: any) {
      // console.log("error", error);
      setShowResponse(error?.response?.data);
    }
  };

  const PostMethod = async () => {
    try {
      const parse = JSON.parse(body);
      const data = await axios.post(
        finalUrl,
        {
          ...parse,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...formattedHeaders,
          },
        }
      );

      setShowResponse(data);
    } catch (error: any) {
      // console.log("error", error);
      setShowResponse(error?.response?.data);
    }
  };

  const PutMethod = async () => {
    try {
      const parse = JSON.parse(body);
      const data = await axios.put(
        finalUrl,
        {
          ...parse,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...formattedHeaders,
          },
        }
      );

      setShowResponse(data);
    } catch (error: any) {
      // console.log("error", error);
      setShowResponse(error?.response?.data);
    }
  };

  const PatchMethod = async () => {
    try {
      const parse = JSON.parse(body);
      const data = await axios.patch(
        finalUrl,
        {
          ...parse,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...formattedHeaders,
          },
        }
      );

      setShowResponse(data);
    } catch (error: any) {
      // console.log("error", error);
      setShowResponse(error?.response?.data);
    }
  };

  const DeleteMethod = async () => {
    try {
      const data = await axios.delete(finalUrl, {
        headers: {
          "Content-Type": "application/json",
          ...formattedHeaders,
        },
      });

      setShowResponse(data);
    } catch (error: any) {
      // console.log("error", error);
      setShowResponse(error?.response?.data);
    }
  };

  const sendRequest = () => {
    if (method === "GET") {
      GetMethod();
      return;
    } else if (method === "POST") {
      PostMethod();
      return;
    } else if (method === "PUT") {
      PutMethod();
      return;
    } else if (method === "PATCH") {
      PatchMethod();
      return;
    } else if (method === "DELETE") {
      DeleteMethod();
      return;
    }
  };

  const formatTime = (ms: number) => {
  if (!ms) return "";
  
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
};

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 200:
        return {
          label: "Success",
          bg: "bg-green-100",
          text: "text-green-700",
        };

      case 201:
        return {
          label: "Created",
          bg: "bg-green-100",
          text: "text-green-700",
        };

      case 301:
        return {
          label: "Redirect",
          bg: "bg-yellow-100",
          text: "text-yellow-700",
        };

      case 400:
        return {
          label: "Bad Request",
          bg: "bg-orange-100",
          text: "text-orange-700",
        };

      case 404:
        return {
          label: "Not Found",
          bg: "bg-orange-100",
          text: "text-orange-700",
        };

      case 500:
        return {
          label: "Server Error",
          bg: "bg-red-100",
          text: "text-red-700",
        };

      case 503:
        return {
          label: "Service Unavailable",
          bg: "bg-red-100",
          text: "text-red-700",
        };

      default:
        return {
          label: "Unknown Status",
          bg: "bg-gray-200",
          text: "text-gray-700",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            API Testing
          </h1>
          <p className="text-gray-600 mt-1">Test your API endpoints</p>
        </div>

        {/* Main Request Builder */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          {/* Method and URL Row */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            {/* Method Dropdown */}
            <div className="relative">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className={`${methodColors[method]} text-white font-semibold px-4 py-3 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 appearance-none pr-10 w-full md:w-auto`}
              >
                {methods.map((m) => (
                  <option key={m} value={m} className="bg-white text-gray-800">
                    {m}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* URL Input */}
            <input
              type="text"
              value={finalUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="Enter request URL"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Send Button */}
            <button
              onClick={() => sendRequest()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <div className="flex flex-wrap gap-2 md:gap-0">
              {["params", "headers", "body"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            {/* Params Tab */}
            {activeTab === "params" && (
              <div className="space-y-3">
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
                      {params.map((param, index) => (
                        <tr key={index} className="group">
                          <td className="py-1">
                            <input
                              type="checkbox"
                              checked={param.enabled}
                              onChange={(e) =>
                                updateParam(index, "enabled", e.target.checked)
                              }
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-1 px-2">
                            <input
                              type="text"
                              value={param.key}
                              onChange={(e) =>
                                updateParam(index, "key", e.target.value)
                              }
                              placeholder="Key"
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-1 px-2">
                            <input
                              type="text"
                              value={param.value}
                              onChange={(e) =>
                                updateParam(index, "value", e.target.value)
                              }
                              placeholder="Value"
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-1">
                            <button
                              onClick={() => removeParam(index)}
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
                  onClick={addParam}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Parameter
                </button>
              </div>
            )}

            {/* Headers Tab */}
            {activeTab === "headers" && (
              <div className="space-y-3">
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
                      {headers.map((header, index) => (
                        <tr key={index} className="group">
                          <td className="py-1">
                            <input
                              type="checkbox"
                              checked={header.enabled}
                              onChange={(e) =>
                                updateHeader(index, "enabled", e.target.checked)
                              }
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-1 px-2">
                            <input
                              type="text"
                              value={header.key}
                              onChange={(e) =>
                                updateHeader(index, "key", e.target.value)
                              }
                              placeholder="Key"
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-1 px-2">
                            <input
                              type="text"
                              value={header.value}
                              onChange={(e) =>
                                updateHeader(index, "value", e.target.value)
                              }
                              placeholder="Value"
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-1">
                            <button
                              onClick={() => removeHeader(index)}
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
                  onClick={addHeader}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Header
                </button>
              </div>
            )}

            {/* Body Tab */}
            {activeTab === "body" && (
              <div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter request body (JSON, XML, etc.)"
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Response Section */}
        {showResponse !== null ? (
          <div className="w-full">
           <div className="flex justify-end items-center gap-3">
             <div
              className={`px-3 my-3 w-fit py-1 flex gap-4 rounded-md border ${
                getStatusInfo(showResponse?.status).bg
              } ${getStatusInfo(showResponse?.status).text}`}
            >
              {showResponse?.status} {getStatusInfo(showResponse?.status).label}
            </div>
            <div
              className={`px-3 my-3 w-fit py-1 gap-4 rounded-md border ${
                getStatusInfo(showResponse?.status).bg
              } ${getStatusInfo(showResponse?.status).text}`}
            >
              {formatTime(showResponse?.time)}
            </div>
           </div>
            <pre
              style={{
                height: "600px",
                overflow: "scroll",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                background: "#1e1e1e",
                color: "white",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              {JSON.stringify(showResponse?.data, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Response
            </h2>
            <div className="bg-gray-100 rounded-lg p-4 min-h-[200px] text-gray-500 flex items-center justify-center">
              Click "Send" to see the response
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
