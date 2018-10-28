import { Entity } from './entity';
import { ProblemPluginInfo } from './problem-plugin-info';

export interface DistributedTaskDefinition extends Entity {
  name: string;
  description: string;
  'definition-guid': string;
  'main-dll-name': string;
  'problem-plugin-info': ProblemPluginInfo;
  'packager-logs': string;
}
