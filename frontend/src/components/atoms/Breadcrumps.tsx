import { Icon } from "@iconify/react";
import React from "react";
import { Link } from "react-router-dom";


type urlType = {
    title: string;
    url: string;
}

export interface BreadcrumpsProps {
    urls: urlType[]
}

export default function Breadcrumps(props: BreadcrumpsProps) {
  return (
    <div className="flex gap-x-2">
        {props.urls.map((url: urlType, index: number) => index < props.urls.length - 1 ? (
            <React.Fragment key={index}>
                <Link to={url.url} className="text-gray-400">{url.title}</Link>
                <Icon icon="material-symbols:chevron-right-rounded" width={24} height={24} className="text-gray-400" />
            </React.Fragment>
        ) : (
            <React.Fragment key={index}>
                <Link to={url.url} className="text-gray-400">{url.title}</Link>
            </React.Fragment>
        ))}
    </div>
  )
}
