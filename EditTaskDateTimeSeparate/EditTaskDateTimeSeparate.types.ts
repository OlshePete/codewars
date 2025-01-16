
export interface IEditTaskDateTimeSeparateProps {
    title:string,
    value:number | null | undefined,
    onChange:(value: number)=>void,
    error:string | null | undefined,
    children?: React.ReactNode; // Add this line
}