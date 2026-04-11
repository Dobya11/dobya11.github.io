import { marked } from 'https://esm.sh/marked'
import { getProject} from '../js/getProjectData.js'
marked.setOptions({ gfm: true });
const { data, content } = await getProject("example");
document.getElementById("TMP").innerHTML  = marked.parse(content);