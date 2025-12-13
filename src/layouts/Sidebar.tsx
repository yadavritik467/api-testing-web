import { ChevronDown, ChevronRight, Folder, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface Request {
  reqId: number;
  reqName: string;
  isEditing: boolean;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
}
interface Folder {
  folderId: number;
  folderName: string;
  isFolderOpen: boolean;
  isEditing: boolean;
  hasRequests: Request[];
}
interface Collection {
  id: number;
  isCollectionOpen: boolean;
  isEditing: boolean;
  collectionName: string;
  hasFolder: Folder[];
}

const Sidebar = () => {
  const methodColors: { [key: string]: any } = {
    GET: "text-green-500",
    POST: "text-yellow-500",
    PUT: "text-blue-500",
    PATCH: "text-purple-500",
    DELETE: "text-red-500",
  };

  const [collection, setCollection] = useState<Collection[]>([]);

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
  };
  return (
    <div className="w-full bg-gray-50 flex flex-col border h-[100vh] overflow-y-scroll">
      <button
        onClick={createCollection}
        className="bg-blue-600 hover:bg-blue-700 mt-4 w-[70%] mx-auto text-white rounded-lg p-5 "
      >
        {" "}
        Create a new collection
      </button>

      <div className="flex flex-col gap-4 ">
        {collection?.map((c, colId) => (
          <div key={colId} className="flex flex-col">
            <div className="cursor-pointer select-none flex border mt-2 items-center">
              {c?.isCollectionOpen ? (
                <ChevronDown
                  onClick={() => toggleCollection(c?.id)}
                  className="text-black"
                />
              ) : (
                <ChevronRight
                  onClick={() => toggleCollection(c?.id)}
                  className="text-black"
                />
              )}
              {c?.isEditing ? (
                <input
                  autoFocus
                  className="border rounded px-2 py-1 w-full"
                  defaultValue={c.collectionName}
                  onBlur={(e) => saveCollectionName(c?.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveCollectionName(c?.id, e.currentTarget.value);
                    }
                  }}
                />
              ) : (
                <p
                  onDoubleClick={() => changeCollectionName(c?.id)}
                  className="w-full px-4 flex justify-between items-center"
                >
                  {c?.collectionName}{" "}
                  <span onClick={() => addFolder(c?.id)} title="Add folder">
                    {" "}
                    <Plus className="text-blue-400" />
                  </span>
                </p>
              )}
            </div>
            {c?.isCollectionOpen && c?.hasFolder?.length ? (
              <div className="flex flex-col">
                {c?.hasFolder?.map((fol, folIndex) => (
                  <div key={folIndex} className="flex flex-col border pl-4 ">
                    <div className=" cursor-pointer flex gap-4 items-center py-3">
                      {fol?.isFolderOpen ? (
                        <ChevronDown
                          onClick={() => toggleFolder(c?.id, fol?.folderId)}
                          className="text-black"
                        />
                      ) : (
                        <ChevronRight
                          onClick={() => toggleFolder(c?.id, fol?.folderId)}
                          className="text-black"
                        />
                      )}
                      <Folder className="text-black" />
                      {fol?.isEditing ? (
                        <input
                          autoFocus
                          className="border rounded px-2 py-1 w-full"
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
                        <p
                          onDoubleClick={() =>
                            changeFolderName(c?.id, fol?.folderId)
                          }
                          className="w-full px-4 flex justify-between items-center"
                        >
                          {fol?.folderName}{" "}
                          <span
                            onClick={() => addRequest(c?.id, fol?.folderId)}
                            title="Add Request"
                          >
                            {" "}
                            <Plus className="text-blue-400" />
                          </span>
                        </p>
                      )}
                    </div>
                    {fol?.isFolderOpen && fol?.hasRequests?.length ? (
                      <div className="flex flex-col">
                        {fol?.hasRequests?.map((req, reqId) => (
                          <div key={reqId} className="flex gap-4 border-2">
                            <p className={methodColors[req?.method]}>
                              {req?.method}
                            </p>
                            {req?.isEditing ? (
                              <input
                                autoFocus
                                className="border rounded px-2 py-1 w-full"
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
                                className="cursor-pointer"
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
