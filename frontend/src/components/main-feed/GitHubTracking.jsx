import React, { useEffect, useState } from "react";
import axios from 'axios';

export default function GitHubTracking({user}) {
    const [activityContent, setActivityContent] = useState(null);

    useEffect(() => {
        // Check that github url is an empty string
        if (user.user.github == "") {
            setActivityContent(
                <h2 className="activities">
                    Error retrieving GitHub information.
                    Please update linked GitHub
                </h2>
            )
        }
        // Github url wasn't empty so use it
        else {
            let gitURL = "https://api.github.com/users/" + user.user.github.split("/")[3] + "/events/public?per_page=10"

            // axios wasn't working with cross origin header, so switched
            // to using fetch
            fetch(gitURL)
            .then(async (postResponse) => {
                let responses = await postResponse.json();

                setActivityContent(
                    responses.map((activity, index) => (
                        <div className={`activities ${index}`}>
                            <h2>{activity.actor.display_login}</h2>
                            <span>{activity.type} at repo: {activity.repo.name}</span>
                            <small> {activity.created_at}</small>
                        </div>
                    ))
                );
            }).catch((error) => {
                console.error("Error getting user's github", error)
            });
        }

    }, []);

    return (
        <>
            <div className="activities_container flex flex-col justify-left overflow-scroll w-full h-[325px] mt-4 bg-white border border-gray-300 p-4 rounded-lg" style={{ boxShadow: "8px 8px 0px 0px rgba(0, 0, 0, 0.2)" }} >
                <h2 className="border-gray-300 border-b-2 border-solid rounded text-lg">
                    GitHub Activity Tracker
                </h2>
                <ul className="mt-2 space-y-2">
                    {activityContent}
                </ul>
            </div>
        </>
    );

};
