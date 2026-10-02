"use client";
import { Button, Dropdown, Label } from "@heroui/react";
import { useNavigate } from "react-router";
import { authClient } from "../utils/auth-client";
import { Card } from "@heroui/react";
import type { Key } from "react";

export function Home() {

    const navigate = useNavigate();
    const { data: session, isPending } = authClient.useSession();
    const handleSelect = async (key: Key) => {

        if (isPending) {
            return;
        }

        if (!session?.user) {
            alert("Please login");
            navigate("/");
            return;
        }
        navigate(`/${session.user.name}/${session.user.id}/${key}`);
    }

    const handleLogout = async () => {
        const { error } = await authClient.signOut();
        if (error) {
            console.error(error);
            alert(error);
            return;
        }
        navigate("/");
    };

    return (
        <main className="w-screen h-screen bg-black text-white flex flex-col justify-center items-center gap-2">
            {session?.user.name && <Card className="w-[30vw]">
                <Card.Header>
                    <Card.Title>Hey {session?.user.name}</Card.Title>
                    <Card.Description>
                        Click below to spin up a repl or choose from your existing.
                    </Card.Description>
                </Card.Header>
                <Card.Footer className="flex justify-between gap-2">
                    <Dropdown>
                        <Button aria-label="Menu" variant="secondary">
                            Choose a language
                        </Button>
                        <Dropdown.Popover>
                            <Dropdown.Menu onAction={(key) => { handleSelect(key) }}>
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
                    <Button onClick={() => handleLogout()}>
                        Sign out
                    </Button>
                </Card.Footer>
            </Card>}

        </main >
    );
}