import { ChevronDown, ChevronRight, Folder, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useCollection } from "../context/Collection";
import { useSearchParams } from "react-router-dom";

export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export interface Request {
  colId?: number;
  folderId?: number;
  reqId: number;
  reqName: string;
  isEditing: boolean;
  method: RequestMethod
  url: string;
}
export interface Folder {
  folderId: number;
  folderName: string;
  isFolderOpen: boolean;
  isEditing: boolean;
  hasRequests: Request[];
}
export interface Collection {
  id: number;
  isCollectionOpen: boolean;
  isEditing: boolean;
  collectionName: string;
  hasFolder: Folder[];
}

export const methodColors1: { [key: string]: any } = {
  GET: "text-green-500",
  POST: "text-yellow-500",
  PUT: "text-blue-500",
  PATCH: "text-purple-500",
  DELETE: "text-red-500",
};

const Sidebar = () => {
  const { setRequestArr } = useCollection();
  const [collection, setCollection] = useState<Collection[]>([]);
  const [_, setSearchParams] = useSearchParams();

  useEffect(() => {
    const stored = localStorage.getItem("collection");
    if (stored) {
      const parsed = JSON.parse(stored) as Collection[];
      setCollection(parsed);
      return;
    } else {
      const collecArr = [
        {
          id: 0,
          isCollectionOpen: true,
          isEditing: false,
          collectionName: "New Collection",
          hasFolder: [
            {
              folderId: 0,
              folderName: "New Folder",
              isFolderOpen: true,
              isEditing: false,
              hasRequests: [
                {
                  reqId: 0,
                  isEditing: false,
                  reqName: "New Request",
                  method: "GET",
                  url: "",
                },
              ],
            },
          ],
        },
      ];
      setCollection(collecArr as Collection[]);
      return;
    }
  }, []);

  useEffect(() => {
    if (collection?.length) {
      localStorage.setItem("collection", JSON.stringify(collection));
    }
  }, [collection]);

  const createCollection = () => {
    setCollection((p) => [
      ...p,
      {
        id: p?.length + 1,
        isCollectionOpen: true,
        isEditing: false,
        collectionName: "New Collection",
        hasFolder: [
          {
            folderId: 0,
            folderName: "New Folder",
            isEditing: false,
            isFolderOpen: true,
            hasRequests: [
              {
                reqId: 0,
                isEditing: false,
                reqName: "New Request",
                method: "GET",
                url: "",
              },
            ],
          },
        ],
      },
    ]);
  };

  // collection logic
  const updateCollection = (
    colId: number,
    fn: (c: Collection) => Collection
  ) => {
    setCollection((cols) => cols?.map((c) => (c.id === colId ? fn(c) : c)));
  };

  const changeCollectionName = (colId: number) => {
    updateCollection(colId, (c) => ({
      ...c,
      isEditing: c?.isEditing === true ? false : true,
    }));
  };

  const saveCollectionName = (colId: number, val: string) => {
    updateCollection(colId, (c) => ({
      ...c,
      collectionName: val,
      isEditing: false,
    }));
  };

  const toggleCollection = (colId: number) => {
    updateCollection(colId, (c) => ({
      ...c,
      isCollectionOpen: !c?.isCollectionOpen,
    }));
  };

  // folder logic
  const updateFolders = (
    colId: number,
    folderId: number,
    fn: (f: Folder) => Folder
  ) => {
    updateCollection(colId, (c) => ({
      ...c,
      hasFolder: c?.hasFolder.map((f) =>
        f?.folderId === folderId ? fn(f) : f
      ),
    }));
  };

  const addFolder = (colId: number) => {
    updateCollection(colId, (c) => ({
      ...c,
      hasFolder: [
        ...c?.hasFolder,
        {
          isEditing: false,
          folderId: c?.hasFolder?.length + 1,
          folderName: "New Request",
          isFolderOpen: false,
          hasRequests: [
            {
              reqId: 0,
              isEditing: false,
              reqName: "New Request",
              method: "GET",
              url: "",
            },
          ],
        },
      ],
    }));
  };
  const changeFolderName = (colId: number, folderId: number) => {
    updateFolders(colId, folderId, (f) => ({
      ...f,
      isEditing: f?.isEditing === true ? false : true,
    }));
  };

  const saveFolderName = (colId: number, folderId: number, val: string) => {
    updateFolders(colId, folderId, (f) => ({
      ...f,
      folderName: val,
      isEditing: false,
    }));
  };

  const toggleFolder = (colId: number, folderId: number) => {
    updateFolders(colId, folderId, (f) => ({
      ...f,
      isFolderOpen: !f?.isFolderOpen,
    }));
  };

  // request logic
  const updateRequest = (
    colId: number,
    folderId: number,
    requestId: number,
    fn: (r: Request) => Request
  ) => {
    updateFolders(colId, folderId, (f) => ({
      ...f,
      hasRequests: f.hasRequests?.map((r) =>
        r?.reqId === requestId ? fn(r) : r
      ),
    }));
  };

  const addRequest = (colId: number, folderId: number) => {
    updateFolders(colId, folderId, (f) => ({
      ...f,
      hasRequests: [
        ...f?.hasRequests,
        {
          isEditing: false,
          method: "GET",
          reqId: f?.hasRequests?.length + 1,
          reqName: "New Request",
          url: "",
        },
      ],
    }));
  };

  const changeRequestName = (
    colId: number,
    folderId: number,
    requestId: number
  ) => {
    updateRequest(colId, folderId, requestId, (r) => ({
      ...r,
      isEditing: r?.isEditing === true ? false : true,
    }));
  };

  const saveRequestName = (
    colId: number,
    folderId: number,
    requestId: number,
    val: string
  ) => {
    updateRequest(colId, folderId, requestId, (r) => ({
      ...r,
      reqName: val,
      isEditing: false,
    }));
    setRequestArr((prev) =>
      prev.map((p) =>
        p?.colId === colId && p?.folderId === folderId && p?.reqId === requestId
          ? { ...p, reqName: val }
          : p
      )
    );
  };

  const createReqTabArr = (
    colId: number,
    folderId: number,
    request: Request
  ) => {
    setSearchParams({
      colId: String(colId),
      folderId: String(folderId),
      reqId: String(request.reqId),
    });
    setRequestArr((prev) => {
      const isExist = prev?.some(
        (f) =>
          f?.colId === colId &&
          f?.folderId === folderId &&
          f?.reqId === request?.reqId
      );

      return isExist ? prev : [...prev, { colId, folderId, ...request }];
    });
  };
  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col h-[100vh] overflow-hidden">
      {/* Header Section */}
      <div className="p-6 bg-white border-b border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Collections</h2>
        <button
          onClick={createCollection}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 w-full text-white rounded-lg p-3 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Collection
        </button>
      </div>

      {/* Collections List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {collection?.map((c, colId) => (
          <div
            key={colId}
            className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {/* Collection Header */}
            <div className="cursor-pointer select-none flex items-center p-3 hover:bg-slate-50 transition-colors duration-150">
              <button
                onClick={() => toggleCollection(c?.id)}
                className="mr-2 p-1 hover:bg-slate-200 rounded transition-colors"
              >
                {c?.isCollectionOpen ? (
                  <ChevronDown className="text-slate-600 w-5 h-5" />
                ) : (
                  <ChevronRight className="text-slate-600 w-5 h-5" />
                )}
              </button>

              {c?.isEditing ? (
                <input
                  autoFocus
                  className="border border-blue-300 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={c.collectionName}
                  onBlur={(e) => saveCollectionName(c?.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveCollectionName(c?.id, e.currentTarget.value);
                    }
                  }}
                />
              ) : (
                <div
                  onDoubleClick={() => changeCollectionName(c?.id)}
                  className="w-full flex justify-between items-center group"
                >
                  <p className="font-semibold text-slate-700 flex-1">
                    {c?.collectionName}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addFolder(c?.id);
                    }}
                    title="Add folder"
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-blue-100 rounded-lg transition-all duration-150"
                  >
                    <Plus className="text-blue-600 w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Folders */}
            {c?.isCollectionOpen && c?.hasFolder?.length ? (
              <div className="border-t border-slate-100">
                {c?.hasFolder?.map((fol, folIndex) => (
                  <div
                    key={folIndex}
                    className="border-b last:border-b-0 border-slate-100"
                  >
                    {/* Folder Header */}
                    <div className="cursor-pointer flex items-center py-2.5 px-3 pl-8 hover:bg-slate-50 transition-colors duration-150 group">
                      <button
                        onClick={() => toggleFolder(c?.id, fol?.folderId)}
                        className="mr-2 p-1 hover:bg-slate-200 rounded transition-colors"
                      >
                        {fol?.isFolderOpen ? (
                          <ChevronDown className="text-slate-500 w-4 h-4" />
                        ) : (
                          <ChevronRight className="text-slate-500 w-4 h-4" />
                        )}
                      </button>

                      <Folder className="text-blue-500 w-4 h-4 mr-2" />

                      {fol?.isEditing ? (
                        <input
                          autoFocus
                          className="border border-blue-300 rounded-lg px-3 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          defaultValue={fol.folderName}
                          onBlur={(e) =>
                            saveFolderName(c?.id, fol?.folderId, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              saveFolderName(
                                c?.id,
                                fol?.folderId,
                                e.currentTarget.value
                              );
                            }
                          }}
                        />
                      ) : (
                        <div
                          onDoubleClick={() =>
                            changeFolderName(c?.id, fol?.folderId)
                          }
                          className="w-full flex justify-between items-center"
                        >
                          <p className="text-sm font-medium text-slate-600 flex-1">
                            {fol?.folderName}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addRequest(c?.id, fol?.folderId);
                            }}
                            title="Add Request"
                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-blue-100 rounded-lg transition-all duration-150"
                          >
                            <Plus className="text-blue-600 w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Requests */}
                    {fol?.isFolderOpen && fol?.hasRequests?.length ? (
                      <div className="bg-slate-50">
                        {fol?.hasRequests?.map((req, reqId) => (
                          <div
                            key={reqId}
                            className="flex items-center gap-3 py-2 px-3 pl-16 hover:bg-white border-b last:border-b-0 border-slate-200 transition-colors duration-150 cursor-pointer group"
                          >
                            <span
                              className={`${
                                methodColors1[req?.method]
                              } font-bold text-xs px-2 py-1 rounded bg-white border border-current min-w-[60px] text-center`}
                            >
                              {req?.method}
                            </span>

                            {req?.isEditing ? (
                              <input
                                autoFocus
                                className="border border-blue-300 rounded-lg px-3 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                defaultValue={req?.reqName}
                                onBlur={(e) =>
                                  saveRequestName(
                                    c?.id,
                                    fol?.folderId,
                                    req?.reqId,
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    saveRequestName(
                                      c?.id,
                                      fol?.folderId,
                                      req?.reqId,
                                      e.currentTarget.value
                                    );
                                  }
                                }}
                              />
                            ) : (
                              <p
                                onDoubleClick={() =>
                                  changeRequestName(
                                    c?.id,
                                    fol?.folderId,
                                    req?.reqId
                                  )
                                }
                                onClick={() =>
                                  createReqTabArr(c?.id, fol?.folderId, req)
                                }
                                className="text-sm text-slate-700 flex-1 truncate group-hover:text-blue-600 transition-colors"
                              >
                                {req?.reqName}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
