//render 进程中不能访问这些 api
// import * as yaml from 'js-yaml'
// import * as fs from 'fs'

// function parseYamlToJson<T>(yamlFilePath: string): T {
//   try {
//     const yamlFileContents = fs.readFileSync(yamlFilePath, 'utf8')
//     const result = yaml.load(yamlFileContents) as T
//     return result
//   } catch (e) {
//     throw new Error(`Failed to parse YAML content: ${e.message}`)
//   }
// }

// export default parseYamlToJson
