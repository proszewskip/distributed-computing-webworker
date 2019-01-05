/**
 * Missing evergreen-ui types
 */

declare module 'evergreen-ui' {
  type Component = any;

  // Layout primitives
  export const Pane: Component;
  export const Card: Component;

  // Typography
  export const Heading: Component;
  export const Text: Component;
  export const Paragraph: Component;
  export const Link: Component;
  export const Strong: Component;
  export const Small: Component;
  export const Pre: Component;
  export const Code: Component;
  export const OrderedList: Component;
  export const UnorderedList: Component;
  export const ListItem: Component;

  // Icons
  export const Icon: Component;

  // Buttons
  export const Button: Component;
  export const IconButton: Component;
  export const BackButton: Component;
  export const TextDropdownButton: Component;

  // Tabs
  export const Tab: Component;
  export const SidebarTab: Component;
  export const Tablist: Component;
  export const TabNavigation: Component;

  // Badge & Pill
  export const Badge: Component;
  export const Pill: Component;

  // Avatar
  export const Avatar: Component;

  // Text inputs & file uploading
  export const TextInput: Component;
  export const TextInputField: Component;
  export const SearchInput: Component;
  export const TagInput: Component;
  export const Textarea: Component;
  export const Autocomplete: Component;
  export const Filepicker: Component;

  // Selects & dropdown menus
  export const Select: Component;
  export const SelectField: Component;
  export const Combobox: Component;
  export const SelectMenu: Component;
  export const Popover: Component;
  export const Menu: Component;

  // Toggles
  export const Checkbox: Component;
  export const Radio: Component;
  export const RadioGroup: Component;
  export const SegmentedControl: Component;
  export const Switch: Component;

  // Feedback indicators
  // Toaster
  export interface ToasterMessageOptions {
    id?: string;

    description?: any;

    /**
     * In seconds
     */
    duration: number;
  }

  type ToasterMethod = (
    message: string,
    options?: ToasterMessageOptions,
  ) => void;

  export declare const toaster: {
    notify: ToasterMethod;
    success: ToasterMethod;
    warning: ToasterMethod;
    danger: ToasterMethod;
    closeAll: () => void;
  };

  export const Alert: Component;
  export const InlineAlert: Component;
  export const Spinner: Component;

  // Overlays
  export const Dialog: Component;
  export const SideSheet: Component;
  export const Tooltip: Component;
  export const CornerDialog: Component;

  // Tables
  export const Table: Component;

  // Utilities & helpers
  export const Portal: Component;
  export const Positioner: Component;
  export const FormField: Component;

  // Scales
  export function minorScale(value: number): number;
  export function majorScale(value: number): number;
}

declare module 'evergreen-ui/*';
