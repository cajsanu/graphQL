import { Link } from "react-router-dom" 

export const ErrorPage = () => {
    return (
        <div>
            <h2>404 not found</h2>
            <Link to="/">Home</Link>
        </div>
    )
}
