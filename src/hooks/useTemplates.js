import { useQuery } from "react-query"
import { toast } from "react-toastify"
import { getTemplates } from "../api";

const useTemplates = ()=>{
    const {data , isLoading , isError , refetch}= useQuery(
        "templates",
        async()=>{
            try {
                const template = await getTemplates();
                return template;
            } catch (error) {
                console.log(error)
                toast.error("Something went wrong")
            }
        }
        ,
        {refetchOnWindowFocus : false}
    )
    return {data , isLoading ,isError , refetch}

}
export default useTemplates;