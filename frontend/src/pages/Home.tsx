"use client";
import { Button, Dropdown, Label, type Key } from "@heroui/react";
import { useNavigate } from "react-router";

interface User {
    name: string;
    email: string;
}

const user = {
    name: "somename",
    email: "somemail"
}

export function Home() {

    const navigate = useNavigate();

    const getUserId = (user: User | null) => {
        // to-do
        return JSON.stringify(user);
    }

    const handleSelect = (user: User | null, key: Key) => {
        if (user == null) {
            alert("Please login")
        }
        navigate(`/${getUserId(user)}/${key}`);
    }

    return (
        <main className="w-screen h-screen bg-black text-white flex flex-col justify-center items-center">
            <Dropdown>
                <Button aria-label="Menu" variant="secondary">
                    Choose a language
                </Button>
                <Dropdown.Popover>
                    <Dropdown.Menu onAction={(key) => handleSelect(user, key)}>
                        <Dropdown.Item id="base-nodejs" textValue="javascript">
                            <Label>Javascript</Label>
                        </Dropdown.Item>
                        <Dropdown.Item id="base-golang" textValue="go">
                            <Label>Go</Label>
                        </Dropdown.Item>
                        <Dropdown.Item id="base-python" textValue="python">
                            <Label>Python</Label>
                        </Dropdown.Item>
                        <Dropdown.Item id="base-react" textValue="react">
                            <Label>React+Vite</Label>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown.Popover>
            </Dropdown>
        </main>
    );
}