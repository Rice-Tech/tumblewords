import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const teamData = [
  {
    name: "Matt Rice",
    role: "Coding Team Lead",
    contributions:
      "Backend, Story Templating, Website, and collaborated on 3D game",
    links: "www.ricecodes.com",
  },
  {
    name: "Steven Ostuni",
    role: "Art Team Lead",
    contributions: "3D Scene, Character designs",
    links: "",
  },
  {
    name: "Josh Batugo",
    role: "Coding Team",
    contributions: "Collaborated on 3D game",
    links: "",
  },
  {
    name: "Tojo Rabemananjara",
    role: "Coding Team",
    contributions: "Collaborated on 3D game",
    links: "",
  },
  {
    name: "Joel Landy",
    role: "Art Team",
    contributions: "2D Art",
    links: "",
  },
  {
    name: "Matt",
    role: "Art Team",
    contributions: "2D Art",
    links: "",
  },
];

const About = () => {
  return (
    <div className=" h-screen overflow-auto relative">
      <div>
        About
        {teamData.map((member) => (
          <Card className=" w-2/3">
            <CardHeader>
              <CardTitle>{member.name}</CardTitle>
              <CardDescription>{member.role}</CardDescription>
            </CardHeader>
            <CardContent>Contributions: {member.contributions}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default About;
