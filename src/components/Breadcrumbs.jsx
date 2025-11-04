import { Breadcrumb } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs({ labelsMap = {}, idsMap = {} }) {
    const location = useLocation();
    const pathSegments = location.pathname.split("/").filter(Boolean);

    const breadcrumbs = pathSegments
        .filter(segment => isNaN(segment) && !/^[a-z0-9]{20,}$/.test(segment)) 
        .map((segment, index) => {
            const path = "/" + pathSegments.slice(0, index + 1).join("/");

            const isLast = index === pathSegments.length - 1;
            const label = labelsMap[segment] || segment.replace(/-/g, " ");

            const id = idsMap[segment];
            const linkPath = id ? `${path}/${id}` : path;

            return (
                <Breadcrumb.Item
                    key={path}
                    linkAs={Link}
                    linkProps={isLast ? {} : { to: linkPath }}
                    active={isLast}
                    className="custom-breadcrumb-link"
                >
                    {label}
                </Breadcrumb.Item>
            );
        });

    return <Breadcrumb>{breadcrumbs}</Breadcrumb>;
}
