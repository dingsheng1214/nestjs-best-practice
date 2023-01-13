import * as fs from 'fs';
import * as path from 'path';

import { parse } from 'yaml';

/**
 * 根据process.env.NODE_ENV读取配置文件:
 * 1. dev-> dev.yaml
 * 2. test-> test.yaml
 * 3. prod-> prod.yaml
 */
export const getConfig = () => {
    const environment = process.env.NODE_ENV;
    const projectPath = process.cwd();
    const yamlPath = path.join(projectPath, `./.config/${environment}.yml`);
    const file = fs.readFileSync(yamlPath, 'utf8');
    const config = parse(file);
    return config;
};
