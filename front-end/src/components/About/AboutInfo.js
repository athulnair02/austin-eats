// Profile pictures
import AthulPFP from "../../assets/profilepictures/Athul.jpg";
import ChristianPFP from "../../assets/profilepictures/Christian.png";
import ClintPFP from "../../assets/profilepictures/Clint.jpg";
import MihikaPFP from "../../assets/profilepictures/Mihika.jpg";
import ThomasPFP from "../../assets/profilepictures/Thomas.jpg";

// Tool Logos
import ReactLogo from "../../assets/tools/ReactLogo.png";
import BootstrapLogo from "../../assets/tools/ReactBootstrapLogo.png";
import MaterialLogo from "../../assets/tools/MaterialUILogo.png";
import GitLabLogo from "../../assets/tools/GitLabLogo.png";
import PostmanLogo from "../../assets/tools/PostmanLogo.png";
import NamecheapLogo from "../../assets/tools/NamecheapLogo.png";
import AWSLogo from "../../assets/tools/AWSLogo.png";
import DiscordLogo from "../../assets/tools/DiscordLogo.png";
import PrettierLogo from "../../assets/tools/prettierLogo.svg";
import BlackLogo from "../../assets/tools/BlackLogo.png";

// API logos
import YelpLogo from "../../assets/tools/YelpLogo.png";
import SpoonacularLogo from "../../assets/tools/SpoonacularLogo.png"
import RESTCountriesLogo from "../../assets/tools/RESTCountriesLogo.png"

const teamInfo = [
  {
    Name: "Athul Nair",
    Username: "athuln",
    Email: "athulnair@utexas.edu",
    Role: "Full Stack",
    Photo: AthulPFP,
    Bio: "I am a junior at UT Austin majoring in computer science and minoring in business. In my free time I love to deweed my garden and play some casual sand volleyball.",
    Commits: 0,
    Issues: 0,
    Tests: 10,
  },
  {
    Name: "Christian Camp",
    Username: "Repoised",
    Email: "christiandcamp@hotmail.com",
    Role: "Front End",
    Photo: ChristianPFP,
    Bio: "I'm Christian Camp, a Computer Science major who finds joy in creating and programming games!",
    Commits: 0,
    Issues: 0,
    Tests: 10,
  },
  {
    Name: "Clint Camp",
    Username: "xXDarkEyesXx",
    Email: "clintcamp@hotmail.com",
    Role: "Back End",
    Photo: ClintPFP,
    Bio: "I'm Clint, a UT Austin student who is passionate about game development. I stop by Gong Cha far too frequently.",
    Commits: 0,
    Issues: 0,
    Tests: 6,
  },
  {
    Name: "Mihika Birmiwal",
    Username: "mihikabirmiwal",
    Email: "mihika@cs.utexas.edu",
    Role: "Back End",
    Photo: MihikaPFP,
    Bio: "I am a junior at UT Austin majoring in computer science and minoring in economics. In my free time I love to play tennis and go grocery shopping!",
    Commits: 0,
    Issues: 0,
    Tests: 4,
  },
  {
    Name: "Thomas Moore",
    Username: "tmooretcm",
    Email: "tmooretcm@utexas.edu",
    Role: "Front End",
    Photo: ThomasPFP,
    Bio: "I am a junior at UT Austin majoring in computer science and minoring in social work. I love to climb, inside and out. I also love cooking and gardening!",
    Commits: 0,
    Issues: 0,
    Tests: 0,
  },
];

const toolInfo = [
  {
    Logo: AWSLogo,
    Link: "https://aws.amazon.com/",
    Title: "Amazon Web Service",
    Desc: "Tool used for cloud hosting",
  },

  {
    Logo: ReactLogo,
    Link: "https://www.reactjs.org/",
    Title: "React",
    Desc: "JavaScript framework used for UI front-end web development",
  },

  {
    Logo: BootstrapLogo,
    Link: "https://react-bootstrap.github.io/",
    Title: "React Bootstrap",
    Desc: "JavaScript library used for UI foundation",
  },

  {
    Logo: MaterialLogo,
    Link: "https://mui.com/",
    Title: "Material UI",
    Desc: "JavaScript library used for UI foundation",
  },

  {
    Logo: PrettierLogo,
    Link: "https://prettier.io/",
    Title: "Prettier",
    Desc: "Code formatter",
  },

  {
    Logo: BlackLogo,
    Link: "https://pypi.org/project/black/",
    Title: "Black",
    Desc: "Tool for Python code formatting",
  },

  {
    Logo: NamecheapLogo,
    Link: "https://www.namecheap.com/",
    Title: "Namecheap",
    Desc: "Domain name registrar",
  },

  {
    Logo: GitLabLogo,
    Link: "https://www.gitlab.com",
    Title: "GitLab",
    Desc: "Git repository and CI/CD platform",
  },

  {
    Logo: PostmanLogo,
    Link: "https://www.postman.com/",
    Title: "Postman",
    Desc: "Tool used for design and testing of our API",
  },

  {
    Logo: DiscordLogo,
    Link: "https://www.discord.com/",
    Title: "Discord",
    Desc: "Tool for communication with team members",
  },
];

const dataSourceInfo = [
  {
    Logo: YelpLogo,
    Link: "https://www.yelp.com",
    Title: "Yelp",
    Desc: "API for Restaurant business ",
  },

  {
    Logo: GitLabLogo,
    Link: "https://www.gitlab.com",
    Title: "GitLab",
    Desc: "API for Git repository statistics",
  },

  {
    Logo: SpoonacularLogo,
    Link: "https://spoonacular.com/food-api",
    Title: "Spoonacular",
    Desc: "API for recipe data",
  },

  {
    Logo: RESTCountriesLogo,
    Link: "https://restcountries.com/",
    Title: "REST Countries",
    Desc: "API for information on countries",
  },
];

const repoAndAPI = [
  {
    Logo: GitLabLogo,
    Link: "https://gitlab.com/mihikabirmiwal/cs373-idb",
  },
  {
    Logo: PostmanLogo,
    Link: "https://documenter.getpostman.com/view/23508831/2s83tJGW4m",
  },
];

export { teamInfo, toolInfo, dataSourceInfo, repoAndAPI };
