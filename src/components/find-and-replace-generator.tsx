'use client'
import {toast} from 'sonner'
import { useState, useEffect, useRef } from "react";
import { Copy, Check, Terminal, FileText, Zap, Eye, Search } from "lucide-react";
import { scrollSectionIntoView, focusSection } from "@/helpers/scroll";

import {
    Button,
    Input,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Badge,
    Label,
} from "ui";

type TCommand = {
  title: string;
  description: string;
  command: string;
  type?: 'primary' | 'secondary' | 'danger';
  vimExplanation?: string;
}
type TSyntaxToken = {
  text: string;
  type: 'keyword' | 'string' | 'function' | 'comment' | 'operator' | 'number' | 'text';
}
export function FindReplaceGenerator() {
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [filePath, setFilePath] = useState("");
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [animatingCards, setAnimatingCards] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState('neovim');
  const activeTabRef = useRef<'neovim' | 'cli'>('neovim');
  const [highlightedField, setHighlightedField] = useState<null | 'find' | 'replace' | 'file'>(null);
  const [activeIndicator, setActiveIndicator] = useState<null | 'inputs' | 'neovim' | 'cli'>(null);
  const [autoJumpToInputs, setAutoJumpToInputs] = useState(false);
  const [highlightedSection, setHighlightedSection] = useState<TJumpTarget | null>(null);
  const findInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const filePathInputRef = useRef<HTMLInputElement>(null);
  const inputsSectionRef = useRef<HTMLDivElement>(null);
  const tabsTopRef = useRef<HTMLDivElement>(null);
  const nvimSectionRef = useRef<HTMLDivElement>(null);
  const cliSectionRef = useRef<HTMLDivElement>(null);
  type TTabId = 'neovim' | 'cli';
  type TJumpTarget = 'inputs' | 'activeTab';
  const lastJumpTargetRef = useRef<TJumpTarget>('activeTab');
  function getActiveTabSectionRef(
      currentTab: TTabId,
      nvimRef: React.RefObject<HTMLDivElement | null>,
      cliRef: React.RefObject<HTMLDivElement | null>
    ): React.RefObject<HTMLDivElement | null> {
      if (currentTab === 'neovim') return nvimRef;
      return cliRef;
    }
  const copyModeRef = useRef(false);
  const copyModeTimerRef = useRef<number | null>(null);
  const copyModeTabRef = useRef<'neovim' | 'cli'>('neovim');
  function isEditableElement(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    if (target.isContentEditable) return true;
    const tag = target.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select';
  }
  function highlightSectionOnce(target: TJumpTarget): void {
    setHighlightedSection(target);
    window.setTimeout(function clear() {
      setHighlightedSection(null);
    }, 800);
  }
  function getNumberFromCode(code: string): number | null {
    const map: Record<string, number> = {
      Digit1: 1, Digit2: 2, Digit3: 3, Digit4: 4, Digit5: 5, Digit6: 6,
      Numpad1: 1, Numpad2: 2, Numpad3: 3, Numpad4: 4, Numpad5: 5, Numpad6: 6,
    };
    return Object.prototype.hasOwnProperty.call(map, code) ? map[code] : null;
  }
  useEffect(() => {
    if (!highlightedField) return;
    const t = window.setTimeout(function clear() { setHighlightedField(null); }, 600);
    return function cleanup() { window.clearTimeout(t); };
  }, [highlightedField]);
  useEffect(() => {
    if (!activeIndicator) return;
    const t = window.setTimeout(function clear() { setActiveIndicator(null); }, 600);
    return function cleanup() { window.clearTimeout(t); };
  }, [activeIndicator]);
  function scrollToEl(el: HTMLElement | null) {
    if (!el) return;
    scrollSectionIntoView(el);
  }
  function enterCopyMode(sourceTab: 'neovim' | 'cli') {
    copyModeRef.current = true;
    copyModeTabRef.current = sourceTab;
    if (copyModeTimerRef.current) {
      window.clearTimeout(copyModeTimerRef.current);
    }
    copyModeTimerRef.current = window.setTimeout(() => {
      exitCopyMode();
    }, 1200);
    toast('Copy mode: press 1–6', { duration: 1200 });
    setActiveIndicator(sourceTab);
  }
  function exitCopyMode() {
    if (copyModeTimerRef.current) {
      window.clearTimeout(copyModeTimerRef.current);
      copyModeTimerRef.current = null;
    }
    copyModeRef.current = false;
  }
  useEffect(() => {
    if (typeof window === 'undefined') return;
    findInputRef.current?.focus();
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) return;
      if (event.ctrlKey || event.metaKey) return;
      if (copyModeRef.current) {
        const n = getNumberFromCode(event.code);
        if (n !== null) {
          event.preventDefault();
          const index = n - 1;
          const sourceTab = copyModeTabRef.current;
          const commands = sourceTab === 'neovim' ? generateNeovimCommands() : generateCliCommands();
          if (commands[index]) {
            const animationIndex = sourceTab === 'cli' ? index + 100 : index;
            copyToClipboard(commands[index].command, animationIndex);
          } else {
            toast.warning('No command at that number');
          }
          exitCopyMode();
          return;
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          exitCopyMode();
          return;
        }
      }
      if (event.key.toLowerCase() === 'c' && event.shiftKey && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        enterCopyMode(activeTab as 'neovim' | 'cli');
        return;
      }
      if (event.shiftKey) {
        switch (event.code) {
          case 'Digit1':
            event.preventDefault();
            findInputRef.current?.focus();
            setHighlightedField('find');
            setActiveIndicator('inputs');
            return;
          case 'Digit2':
            event.preventDefault();
            replaceInputRef.current?.focus();
            setHighlightedField('replace');
            setActiveIndicator('inputs');
            return;
          case 'Digit3':
            event.preventDefault();
            filePathInputRef.current?.focus();
            setHighlightedField('file');
            setActiveIndicator('inputs');
            return;
          case 'Space':
            event.preventDefault();
            setActiveTab(prev => {
              const next = prev === 'neovim' ? 'cli' : 'neovim';
              setActiveIndicator(next === 'neovim' ? 'neovim' : 'cli');
              return next;
            });
            return;
          case 'ArrowUp':
            event.preventDefault();
            setActiveIndicator('inputs');
            scrollToEl(inputsSectionRef.current);
            highlightSectionOnce('inputs');
            return;
          case 'ArrowDown':
            event.preventDefault();
            const targetRef = getActiveTabSectionRef(activeTab as TTabId, nvimSectionRef, cliSectionRef);
            setActiveIndicator(activeTab === 'neovim' ? 'neovim' : 'cli');
            scrollToEl(targetRef.current);
            highlightSectionOnce('activeTab');
            return;
        }
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        if (!findText) {
          findInputRef.current?.focus();
          toast('Enter text to find');
        } else {
          setAnimatingCards(new Set());
          toast('Generated commands');
        }
        return;
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      exitCopyMode();
      if (copyModeTimerRef.current) {
        window.clearTimeout(copyModeTimerRef.current);
      }
    };
  }, [activeTab, findText]);
  useEffect(function syncActiveTabRef() {
    activeTabRef.current = activeTab as 'neovim' | 'cli';
  }, [activeTab]);
  useEffect(function bindShiftT() {
    if (typeof document === 'undefined') return;
    function onKeydown(e: KeyboardEvent): void {
      if (e.defaultPrevented) return;
      if (e.code !== 'KeyT' || !e.shiftKey) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isEditableElement(e.target)) return;
      e.preventDefault();
      const nextTarget: TJumpTarget = lastJumpTargetRef.current === 'inputs' ? 'activeTab' : 'inputs';
      const targetEl = nextTarget === 'inputs'
        ? inputsSectionRef.current
        : getActiveTabSectionRef(activeTabRef.current as TTabId, nvimSectionRef, cliSectionRef).current;
      if (!targetEl) return;
      scrollSectionIntoView(targetEl);
      window.requestAnimationFrame(function afterScroll() {
        focusSection(targetEl);
      });
      highlightSectionOnce(nextTarget);
      lastJumpTargetRef.current = nextTarget;
    }
    document.addEventListener('keydown', onKeydown);
    return function cleanup() {
      document.removeEventListener('keydown', onKeydown);
    };
  }, []);
  function tokenizeCommand(command: string): TSyntaxToken[] {
    const tokens: TSyntaxToken[] = [];
    const patterns = [
      { regex: /:%s|:'<,'>s|sed|find|grep|xargs/g, type: 'keyword' as const },
      { regex: /-[a-zA-Z]+/g, type: 'operator' as const },
      { regex: /\/[^\/]*\//g, type: 'string' as const },
      { regex: /\*\.[a-zA-Z]+/g, type: 'string' as const },
      { regex: /\b\d+\b/g, type: 'number' as const },
      { regex: /\+|\||&/g, type: 'operator' as const },
      { regex: /#.*$/gm, type: 'comment' as const }
    ];
    let remaining = command;
    let currentIndex = 0;
    while (currentIndex < command.length) {
      let matched = false;
      for (const pattern of patterns) {
        pattern.regex.lastIndex = 0;
        const match = pattern.regex.exec(remaining.slice(currentIndex));
        if (match && match.index === 0) {
          if (currentIndex > 0) {
            tokens.push({
              text: remaining.slice(0, currentIndex),
              type: 'text'
            });
          }
          tokens.push({
            text: match[0],
            type: pattern.type
          });
          currentIndex += match[0].length;
          remaining = command.slice(currentIndex);
          matched = true;
          break;
        }
      }
      if (!matched) {
        currentIndex++;
      }
    }
    if (currentIndex < command.length) {
      tokens.push({
        text: command.slice(currentIndex),
        type: 'text'
      });
    }
    return tokens;
  };
type TSyntaxHighlighterProps = { command: string; variant?: 'vim' | 'cli' };
  function SyntaxHighlighter({ command, variant }: TSyntaxHighlighterProps) {
    const tokens = tokenizeCommand(command);
    const variantClass = variant === 'vim' ? 'vim-command' : variant === 'cli' ? 'cli-command' : '';
    return (
      <div className={`font-mono text-sm break-all ${variantClass}`}>
        {tokens.map((token, index) => (
          <span
            key={index}
            className={`${
              token.type === 'keyword' ? 'text-syntax-keyword font-semibold' : 
              token.type === 'string' ? 'text-syntax-string' : 
              token.type === 'function' ? 'text-syntax-function' : 
              token.type === 'comment' ? 'text-syntax-comment italic' : 
              token.type === 'operator' ? 'text-syntax-operator' : 
              token.type === 'number' ? 'text-syntax-number' : 
              'text-code-text'
            }`}
          >
            {token.text}
          </span>
        ))}
      </div>
    );
  };
  function escapeForSed(text: string) {
    return text.replace(/[\/\u0026\\]/g, '\\$&');
  };
  type TToken = { text: string; type: 'operator' | 'number' | 'string' | 'text' };
  function tokenizeText(input: string): TToken[] {
    const tokens: TToken[] = [];
    if (!input) return tokens;
    const reParts = /([.*+?^${}()|\[\]\\\/])|(\b\d+\b)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = reParts.exec(input)) !== null) {
      if (match.index > lastIndex) tokens.push({ text: input.slice(lastIndex, match.index), type: 'text' });
      if (match[1]) tokens.push({ text: match[1], type: 'operator' }); else if (match[2]) tokens.push({ text: match[2], type: 'number' });
      lastIndex = reParts.lastIndex;
    }
    if (lastIndex < input.length) tokens.push({ text: input.slice(lastIndex), type: 'text' });
    return tokens;
  }
  type TInlineHighlighterProps = { value: string };
  function InlineHighlighter({ value }: TInlineHighlighterProps) {
    const tokens = tokenizeText(value);
    return (
      <div className="font-mono text-xs bg-muted/40 border border-code-border rounded px-2 py-1 overflow-x-auto">
        {tokens.map(function render(t, i) {
          const cls = t.type === 'operator' ? 'text-syntax-operator' : t.type === 'number' ? 'text-syntax-number' : t.type === 'string' ? 'text-syntax-string' : 'text-code-text';
          return <span key={i} className={cls}>{t.text}</span>;
        })}
      </div>
    );
  }
  function escapeForVim(text: string) {
    return text.replace(/\//g, '\\/');
  };
  function generateNeovimCommands(): TCommand[] {
    if (!findText) return [];
    const escapedFind = escapeForVim(findText);
    const escapedReplace = escapeForVim(replaceText);
    return [
      {
        title: "Interactive Replace",
        description: "Asks for confirmation before each replacement",
        command: `:%s/${escapedFind}/${escapedReplace}/gc`,
        type: 'primary',
        vimExplanation: "% = entire file, s = substitute, g = global (all occurrences), c = confirm each"
      },
      {
        title: "Replace All",
        description: "Replaces all occurrences without asking",
        command: `:%s/${escapedFind}/${escapedReplace}/g`,
        type: 'secondary',
        vimExplanation: "% = entire file, s = substitute, g = global flag replaces all matches"
      },
      {
        title: "Visual Selection",
        description: "Use after selecting text in visual mode",
        command: `:'<,'>s/${escapedFind}/${escapedReplace}/gc`,
        vimExplanation: "'< = start of visual selection, '> = end of visual selection"
      },
      {
        title: "First Match Only",
        description: "Replaces only the first occurrence on each line",
        command: `:%s/${escapedFind}/${escapedReplace}/`,
        vimExplanation: "Without 'g' flag, only first match per line is replaced"
      },
      {
        title: "Case Insensitive",
        description: "Replace ignoring case differences",
        command: `:%s/${escapedFind}/${escapedReplace}/gi`,
        vimExplanation: "i flag makes the search case-insensitive"
      }
    ];
  };
  function generateCliCommands(): TCommand[] {
    if (!findText) return [];
    const escapedFind = escapeForSed(findText);
    const escapedReplace = escapeForSed(replaceText);
    const file = filePath || "filename.txt";
    return [
      {
        title: "sed - In-place",
        description: "Directly modifies the file",
        command: `sed -i 's/${escapedFind}/${escapedReplace}/g' ${file}`,
        type: 'danger'
      },
      {
        title: "sed - Preview",
        description: "Shows changes without modifying",
        command: `sed 's/${escapedFind}/${escapedReplace}/g' ${file}`,
        type: 'primary'
      },
      {
        title: "sed - With Backup",
        description: "Creates backup before modifying",
        command: `sed -i.bak 's/${escapedFind}/${escapedReplace}/g' ${file}`,
        type: 'secondary'
      },
      {
        title: "find + sed",
        description: "Replace in multiple files",
        command: `find . -name "*.txt" -type f -exec sed -i 's/${escapedFind}/${escapedReplace}/g' {} +`
      },
      {
        title: "grep + sed",
        description: "Only files containing pattern",
        command: `grep -l "${escapedFind}" *.txt | xargs sed -i 's/${escapedFind}/${escapedReplace}/g'`
      }
    ];
  };
async function copyToClipboard(command: string, index: number) {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(command);
      setAnimatingCards(prev => new Set(prev).add(index));
      toast('Copied to clipboard')
      if (autoJumpToInputs) {
        setActiveIndicator('inputs');
        scrollToEl(inputsSectionRef.current);
        highlightSectionOnce('inputs');
        setTimeout(function focusFind() { findInputRef.current?.focus(); }, 0);
      }
      setTimeout(() => {
        setCopiedCommand(null);
        setAnimatingCards(prev => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      toast.error('Could not copy')
    }
  };
type TCommandCardProps = { command: TCommand; animationIndex: number; displayIndex: number; variant: 'vim' | 'cli' };
  function CommandCard({ command, animationIndex, displayIndex, variant }: TCommandCardProps) {
    const isAnimating = animatingCards.has(animationIndex);
    const isCopied = copiedCommand === command.command;
    const variantBadge = variant === 'vim' ? 'VIM' : 'CLI';
    const badgeClass = variant === 'vim' ? 'bg-vim-accent text-vim-foreground' : 'bg-cli-accent text-cli-foreground';
    return (
      <Card className={`mb-4 transition-all duration-300  hover:shadow-lg border-2 ${
        isAnimating ? 'animate-glow' : 'hover:border-accent/50'
      } ${isCopied ? 'border-accent bg-accent/5' : ''} animate-fade-in`} 
      style={{ animationDelay: `${animationIndex * 100}ms` }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium">{command.title}</CardTitle>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${badgeClass}`}>{variantBadge}</span>
              {command.type && (
                <Badge variant={command.type === 'danger' ? 'destructive' : 'secondary'} className="text-xs">
                  {command.type === 'danger' ? 'Destructive' : 
                   command.type === 'primary' ? 'Recommended' : 'Safe'}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">Shift</span>C + {displayIndex}
                </kbd>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(command.command, animationIndex)}
                  className={`h-8 w-8 p-0 transition-all duration-200  ${
                    isCopied ? 'bg-accent text-accent-foreground animate-scale-in' : 'hover:bg-accent/20'
                  }`}
                >
                  {isCopied ? (
                    <Check className="h-3 w-3 animate-scale-in" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
            </div>
          </div>
          <CardDescription className="text-xs">{command.description}</CardDescription>
          {command.vimExplanation && (
            <div className="mt-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground border-l-2 border-accent">
              <Eye className="h-3 w-3 inline mr-1" />
              <strong>VIM Breakdown:</strong> {command.vimExplanation}
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className={`border border-code-border rounded-md p-3 hover:border-accent/30 transition-colors duration-200 ${variant === 'vim' ? 'bg-vim-bg vim-ring' : 'bg-cli-bg cli-ring'}`}>
            <SyntaxHighlighter command={command.command} variant={variant} />
          </div>
        </CardContent>
      </Card>
    );
  };
  useEffect(() => {
    if (findText) {
      setAnimatingCards(new Set());
    }
  }, [findText, replaceText]);
  return (
    <div className="w-full mx-auto  space-y animate-fade-in">
      <Card className="animate-scale-in data-[highlighted=true]:ring-2 data-[highlighted=true]:ring-accent data-[highlighted=true]:ring-offset-2" ref={inputsSectionRef} data-section="inputs" id="section-inputs" data-highlighted={highlightedSection === 'inputs'}>
        <CardContent className="space-y-4  pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`space-y-2 rounded ${highlightedField === 'find' ? 'ring-2 ring-accent' : ''}`}>
              <Label htmlFor="find" className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-syntax-keyword" />
                Find Text *
                 <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">Shift</span>1
                </kbd>
              </Label>
              <Input
                id="find"
                ref={findInputRef}
                placeholder="Enter text to find..."
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                className="font-mono transition-all duration-200 focus:ring-accent focus:border-accent"
              />
              {findText && (
                <InlineHighlighter value={findText} />
              )}
            </div>
            <div className={`space-y-2 rounded ${highlightedField === 'replace' ? 'ring-2 ring-accent' : ''}`}>
              <Label htmlFor="replace" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-syntax-string" />
                Replace With
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">Shift</span>2
                </kbd>
              </Label>
              <Input
                id="replace"
                ref={replaceInputRef}
                placeholder="Enter replacement text..."
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                className="font-mono transition-all duration-200 focus:ring-accent focus:border-accent"
              />
              {replaceText && (
                <InlineHighlighter value={replaceText} />
              )}
            </div>
          </div>
          <div className={`space-y-2 rounded ${highlightedField === 'file' ? 'ring-2 ring-accent' : ''}`}>
            <Label htmlFor="file" className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-syntax-function" />
              File Path (optional)
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">Shift</span>3
                </kbd>
            </Label>
            <Input
              id="file"
              ref={filePathInputRef}
              placeholder="e.g., /path/to/file.txt or *.js"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              className="font-mono transition-all duration-200 focus:ring-accent focus:border-accent"
            />
            {filePath && (
              <InlineHighlighter value={filePath} />
            )}
          </div>
        </CardContent>
      </Card>
      {findText && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" ref={tabsTopRef}>
            <TabsList className={`grid w-full grid-cols-2 bg-card`}>
              <TabsTrigger value="neovim" className="flex items-center gap-2 transition-all duration-200">
                <Terminal className="h-4 w-4" />
                Neovim/Vim
                <span className="ml-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <kbd className="kbd" aria-pressed="false"><span>Shift</span> Space</kbd>
                  <span className="opacity-70">Toggle</span>
                </span>
                <span className="ml-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <kbd className="kbd" aria-pressed="false"><span>Shift</span> T</kbd>
                  <span className="opacity-70">Jump</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="cli" className="flex items-center gap-2 transition-all duration-200">
                <Terminal className="h-4 w-4" />
                CLI Tools
              </TabsTrigger>
            </TabsList>
          <TabsContent value="neovim" className="mt-6">
            <div className="space-y-4 rounded-md data-[highlighted=true]:ring-2 data-[highlighted=true]:ring-accent data-[highlighted=true]:ring-offset-2" ref={nvimSectionRef} data-section="nvim" id="section-nvim" data-highlighted={highlightedSection === 'activeTab'}>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent animate-pulse" />
                Neovim/Vim Commands
              </h3>
{generateNeovimCommands().map((cmd, idx) => (
                <CommandCard key={`vim-${idx}`} command={cmd} animationIndex={idx} displayIndex={idx + 1} variant={'vim'} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="cli" className="mt-6">
            <div className="space-y-4 rounded-md data-[highlighted=true]:ring-2 data-[highlighted=true]:ring-accent data-[highlighted=true]:ring-offset-2" ref={cliSectionRef} data-section="cli" id="section-cli" data-highlighted={highlightedSection === 'activeTab'}>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Terminal className="h-5 w-5 text-accent" />
                CLI Commands
              </h3>
{generateCliCommands().map((cmd, idx) => (
                <CommandCard key={`cli-${idx}`} command={cmd} animationIndex={idx + 100} displayIndex={idx + 1} variant={'cli'} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
      {!findText && (
        <Card className="border-dashed border-2 hover:border-accent/50 transition-colors duration-300 animate-fade-in">
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground flex items-center gap-2">
              <Search className="h-4 w-4" />
              Enter text to find to generate commands
            </p>
          </CardContent>
        </Card>
      )}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <Button
          variant={autoJumpToInputs ? 'default' : 'outline'}
          size="sm"
          onClick={() => setAutoJumpToInputs(prev => !prev)}
          className={autoJumpToInputs ? 'ring-2 ring-accent scale-[1.02]' : ''}
        >
          Jump to Inputs on Copy
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setActiveIndicator('inputs'); scrollToEl(inputsSectionRef.current); highlightSectionOnce('inputs'); }}
          className={activeIndicator === 'inputs' ? 'ring-2 ring-accent scale-[1.02]' : ''}
        >
          Inputs
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setActiveIndicator('neovim'); scrollToEl(nvimSectionRef.current); highlightSectionOnce('activeTab'); }}
          className={activeIndicator === 'neovim' ? 'ring-2 ring-accent scale-[1.02]' : ''}
        >
          Neovim
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setActiveIndicator('cli'); scrollToEl(cliSectionRef.current); highlightSectionOnce('activeTab'); }}
          className={activeIndicator === 'cli' ? 'ring-2 ring-accent scale-[1.02]' : ''}
        >
          CLI
        </Button>
      </div>
    </div>
  );
};
