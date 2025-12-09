import { ArrowRight, ChevronDown, ChevronRight, Folder } from "lucide-react";
import { useState } from "react";

interface Collection {
  id: number;
  isCollectionOpen: boolean;
  isDubbleClick: boolean;
  collectionName: string;
  hasFolder: {
    folderId: number;
    folderName: string;
    isFolderOpen:boolean,
    isDubbleClick: boolean;
    hasRequests: {
      reqId: number;
      reqName: string;
      isDubbleClick: boolean;
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      url: string;
    }[];
  }[];
}

const Sidebar = () => {
    const methodColors: { [key: string]: any } = {
    GET: "text-green-500",
    POST: "text-yellow-500",
    PUT: "text-blue-500",
    PATCH: "text-purple-500",
    DELETE: "text-red-500",
  };

  const [inputVal,setInputVal] =useState<string>("")
   const [collection, setCollection] = useState<Collection[]>([
    {
      id: 0,
      isCollectionOpen: true,
      isDubbleClick:false,
      collectionName: "New Collection",
      hasFolder: [
        {
          folderId: 0,
          folderName: "New Folder",
          isFolderOpen:true,
          isDubbleClick:false,
          hasRequests: [
            {
              reqId: 0,
              isDubbleClick:false,
              reqName: "New Request",
              method: "GET",
              url: "",
            },
          ],
        },
      ],
    },
  ]);

  const createCollection =()=>{
    setCollection(p=>[...p,
         {
      id: p?.length +1 ,
      isCollectionOpen: true,
      isDubbleClick:false,
      collectionName: "New Collection",
      hasFolder: [
        {
          folderId: 0,
          folderName: "New Folder",
          isDubbleClick:false,
          isFolderOpen:true,
          hasRequests: [
            {
              reqId: 0,
              isDubbleClick:false,
              reqName: "New Request",
              method: "GET",
              url: "",
            },
          ],
        },
      ],
    },
    ])
  }

  const changeCollectionName=(colId:number)=>{
    // todo:

    // setCollection(collect =>{
    //     const updateCol = collect?.map((c,i)=>{
    //         if(colId === i){
    //             return {
    //                 ...c,
    //                 isCollectionOpen : !c?.isCollectionOpen
    //             }
    //         }else{
    //             return c
    //         }
    //     })
    //    return updateCol
    //  })
  }

  const toggleCollection =(colId:number)=>{
     setCollection(collect =>{
        const updateCol = collect?.map((c,i)=>{
            if(colId === i){
                return {
                    ...c,
                    isCollectionOpen : !c?.isCollectionOpen
                }
            }else{
                return c
            }
        })
       return updateCol
     })
  }
  const toggleFolder =(colId:number,folIndex:number)=>{
     setCollection(collect =>{
        const updateCol = collect?.map((c,i)=>{
            if(colId === i){
               const updateFolders = c?.hasFolder.map((fol,i)=>
                folIndex === i ? { ...fol , isFolderOpen:!fol?.isFolderOpen } : fol
              )
                return {
                    ...c,
                    hasFolder : updateFolders
                }
            }else{
                return c
            }
        })
       return updateCol
     })
  }
  return (
    <div className="w-full bg-gray-50 flex flex-col border h-[100vh] overflow-y-scroll">
      <button onClick={createCollection} className="bg-blue-600 hover:bg-blue-700 mt-4 w-[70%] mx-auto text-white rounded-lg p-5 ">
        {" "}
        Create a new collection
      </button>

      <div className="flex flex-col gap-4 ">
        {collection?.map((c, colId) => (
          <div key={colId} className="flex flex-col">
            <div  className="cursor-pointer select-none flex border mt-2 items-center">
              {c?.isCollectionOpen ? <ChevronDown onClick={()=>toggleCollection(colId)} className="text-black" />  :<ChevronRight onClick={()=>toggleCollection(colId)} className="text-black" />} 
              <p onDoubleClick={()=>changeCollectionName(colId)}>{c?.collectionName}</p>
            </div>
            {c?.isCollectionOpen && c?.hasFolder?.length ? (
              <div className="flex flex-col">
                {c?.hasFolder?.map((fol, folIndex) => (
                  <div
                    key={folIndex}
                    className="flex flex-col border flex-col pl-4 "
                  >
                    <div className=" cursor-pointer flex gap-4 items-center py-3">
                      <Folder onClick={()=>toggleFolder( colId,folIndex)} className="text-black" />
                      <p>{fol?.folderName}</p>
                    </div>
                    {fol?.isFolderOpen && fol?.hasRequests?.length ? (
                      <div className="flex flex-col">
                        {fol?.hasRequests?.map((req, reqId) => (
                          <div key={reqId} className="flex gap-4 border-2">
                            <p className={methodColors[req?.method]}>{req?.method}</p>
                            <p>{req?.reqName}</p>
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
