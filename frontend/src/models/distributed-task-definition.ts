import { ProblemPluginInfo } from './problem-plugin-info';

export interface DistributedTaskDefinition {
  id: string;
  name: string;
  description: string;
  'definition-guid': string;
  'main-dll-name': string;
  'problem-plugin-info': ProblemPluginInfo;
  'packager-logs': string;
}
