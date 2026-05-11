import { CreateProject } from "@/components/create-project";

export default function ProjectPage() {
    // const projects = getProjects(); //useQuery?
    const projects = null;
    if (!projects) 
        return (
            <div className="p-2">
                <CreateProject/>
            </div>
        )
    return (
        <div>
            list of Projects
        </div>
    )    
}