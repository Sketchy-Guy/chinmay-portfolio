import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronRight } from 'lucide-react';
import { usePortfolioData } from '@/contexts/DataContext';

interface TerminalCommand {
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

const InteractiveTerminal = () => {
  const [isActive, setIsActive] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalCommand[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { data } = usePortfolioData();

  const availableCommands = {
    // Portfolio Commands
    help: 'Show all available commands',
    about: 'Display about information',
    skills: 'Show technical skills',
    projects: 'List all projects',
    experience: 'Show work experience',
    education: 'Display education background',
    contact: 'Show contact information',
    social: 'Display social media links',
    certifications: 'List certifications',
    timeline: 'Show career timeline',
    achievements: 'Display achievements',
    
    // Linux System Commands
    ls: 'List directory contents',
    pwd: 'Print working directory',
    cd: 'Change directory',
    mkdir: 'Create directory',
    rmdir: 'Remove directory',
    rm: 'Remove files',
    cp: 'Copy files',
    mv: 'Move/rename files',
    cat: 'Display file contents',
    grep: 'Search text patterns',
    find: 'Find files and directories',
    which: 'Locate command',
    whereis: 'Locate binary, source, manual',
    man: 'Display manual pages',
    history: 'Command history',
    
    // System Information
    uname: 'System information',
    whoami: 'Current user',
    id: 'User and group IDs',
    uptime: 'System uptime',
    date: 'Current date and time',
    ps: 'Running processes',
    top: 'System monitor',
    df: 'Disk space usage',
    free: 'Memory usage',
    lscpu: 'CPU information',
    
    // Network Commands
    ping: 'Test network connectivity',
    wget: 'Download files',
    curl: 'Transfer data',
    ssh: 'Secure shell',
    
    // Text Processing
    echo: 'Display text',
    head: 'Show first lines',
    tail: 'Show last lines',
    wc: 'Word count',
    sort: 'Sort lines',
    uniq: 'Remove duplicates',
    
    // System Control
    clear: 'Clear terminal',
    exit: 'Exit terminal',
    sudo: 'Execute as superuser',
    chmod: 'Change permissions',
    chown: 'Change ownership',
    
    // Development Commands
    git: 'Version control',
    npm: 'Node package manager',
    node: 'Node.js runtime',
    python: 'Python interpreter',
    gcc: 'GNU compiler',
    make: 'Build automation',
    vim: 'Text editor',
    nano: 'Simple text editor'
  };

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleTerminalClick = () => {
    if (!isActive) {
      setIsActive(true);
      setHistory([{
        command: 'system',
        output: (
          <div className="text-cyan-400">
            <p>Terminal activated. Type '<span className="text-yellow-400 font-bold">help</span>' to see available commands.</p>
          </div>
        ),
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const executeCommand = (cmd: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const command = cmd.toLowerCase().trim();
    
    // Add to command history
    if (command && !commandHistory.includes(command)) {
      setCommandHistory(prev => [...prev, command]);
    }
    setHistoryIndex(-1);

    let output: React.ReactNode;

    switch (command) {
      case 'help':
        output = (
          <div className="text-cyan-400">
            <p className="text-yellow-400 mb-2">Available Commands:</p>
            {Object.entries(availableCommands).map(([cmd, desc]) => (
              <div key={cmd} className="mb-1">
                <span className="text-green-400 font-mono">{cmd.padEnd(15)}</span>
                <span className="text-gray-300">{desc}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'about':
        output = (
          <div className="text-cyan-400">
            <p className="text-yellow-400 mb-2">About {data.user.name}:</p>
            <p className="text-gray-300 mb-2">{data.user.bio}</p>
            <p><span className="text-green-400">Role:</span> {data.user.title}</p>
            <p><span className="text-green-400">Location:</span> {data.user.location}</p>
            <p><span className="text-green-400">Email:</span> {data.user.email}</p>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="text-cyan-400">
            <p className="text-yellow-400 mb-2">Technical Skills:</p>
            {data.skills.reduce((acc: any, skill) => {
              if (!acc[skill.category]) acc[skill.category] = [];
              acc[skill.category].push(skill);
              return acc;
            }, {}) && Object.entries(data.skills.reduce((acc: any, skill) => {
              if (!acc[skill.category]) acc[skill.category] = [];
              acc[skill.category].push(skill);
              return acc;
            }, {})).map(([category, skills]: [string, any]) => (
              <div key={category} className="mb-3">
                <p className="text-green-400 font-semibold">{category}:</p>
                {skills.map((skill: any, index: number) => (
                  <div key={index} className="ml-4 flex items-center">
                    <span className="text-gray-300 mr-2">{skill.name}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < skill.level ? 'text-yellow-400' : 'text-gray-600'}>★</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="text-cyan-400">
            <p className="text-yellow-400 mb-2">Project Portfolio:</p>
            {data.projects.map((project, index) => (
              <div key={index} className="mb-3 border-l-2 border-green-400 pl-3">
                <p className="text-green-400 font-semibold">{project.title}</p>
                <p className="text-gray-300 text-sm">{project.description}</p>
                <p className="text-blue-400 text-xs">Tech: {project.technologies.join(', ')}</p>
                {project.github && <p className="text-purple-400 text-xs">GitHub: {project.github}</p>}
                {project.demo && <p className="text-purple-400 text-xs">Demo: {project.demo}</p>}
              </div>
            ))}
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="text-cyan-400">
            <p className="text-yellow-400 mb-2">Contact Information:</p>
            <p><span className="text-green-400">Email:</span> {data.user.email}</p>
            <p><span className="text-green-400">Phone:</span> {data.user.phone}</p>
            <p><span className="text-green-400">Location:</span> {data.user.location}</p>
            <p className="text-gray-400 mt-2">Type 'social' to see social media links</p>
          </div>
        );
        break;

      case 'social':
        output = (
          <div className="text-cyan-400">
            <p className="text-yellow-400 mb-2">Social Media Links:</p>
            {Object.entries(data.user.social).map(([platform, url]) => (
              url ? (
                <p key={platform}>
                  <span className="text-green-400 capitalize">{platform}:</span> 
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 ml-2">
                    {url}
                  </a>
                </p>
              ) : null
            ))}
          </div>
        );
        break;

      case 'certifications':
        output = (
          <div className="text-cyan-400">
            <p className="text-yellow-400 mb-2">Certifications:</p>
            {data.certifications.map((cert, index) => (
              <div key={index} className="mb-2">
                <p className="text-green-400">{cert.title}</p>
                <p className="text-gray-300 text-sm">Issued by: {cert.issuer} ({cert.date})</p>
                {cert.link && (
                  <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:text-blue-300">
                    View Certificate
                  </a>
                )}
              </div>
            ))}
          </div>
        );
        break;

      case 'whoami':
        output = (
          <div className="text-cyan-400">
            <p className="text-green-400">{data.user.name.toLowerCase().replace(' ', '_')}</p>
          </div>
        );
        break;

      // Linux System Commands
      case 'ls':
        output = (
          <div className="text-cyan-400">
            <p className="text-yellow-400 mb-2">Portfolio Contents:</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-blue-400">about.md</div>
              <div className="text-blue-400">skills.json</div>
              <div className="text-blue-400">projects/</div>
              <div className="text-blue-400">contact.txt</div>
              <div className="text-blue-400">social.yml</div>
              <div className="text-blue-400">certs/</div>
            </div>
          </div>
        );
        break;

      case 'pwd':
        output = (
          <div className="text-cyan-400">
            <p className="text-green-400">/home/{data.user.name?.toLowerCase().replace(' ', '_')}/portfolio</p>
          </div>
        );
        break;

      case 'uname':
        output = (
          <div className="text-cyan-400">
            <p>Portfolio OS 2.0.1 (Developer Edition)</p>
            <p>Built with React + TypeScript + Supabase</p>
          </div>
        );
        break;

      case 'uptime':
        output = (
          <div className="text-cyan-400">
            <p>System has been running for: 5+ years</p>
            <p>Load average: High Performance, Zero Downtime</p>
          </div>
        );
        break;

      case 'date':
        output = (
          <div className="text-cyan-400">
            <p>{new Date().toString()}</p>
          </div>
        );
        break;

      case 'ps':
        output = (
          <div className="text-cyan-400">
            <p className="text-yellow-400 mb-2">Running Processes:</p>
            <div className="space-y-1">
              <div>1234 reactjs         24.5% CPU  Frontend Framework</div>
              <div>5678 typescript      18.2% CPU  Type Safety</div>
              <div>9012 supabase        12.8% CPU  Backend Services</div>
              <div>3456 creativity      45.0% CPU  Problem Solving</div>
            </div>
          </div>
        );
        break;

      case 'free':
        output = (
          <div className="text-cyan-400">
            <p className="text-yellow-400 mb-2">Memory Usage:</p>
            <div>Skills:    5.2GB / 8GB   (65% utilized)</div>
            <div>Projects: 3.8GB / 8GB   (47% utilized)</div>
            <div>Ideas:    7.9GB / 8GB   (99% utilized)</div>
          </div>
        );
        break;

      case 'df':
        output = (
          <div className="text-cyan-400">
            <p className="text-yellow-400 mb-2">Disk Usage:</p>
            <div>/skills     85%  [████████▌ ]</div>
            <div>/projects   72%  [███████▏  ]</div>
            <div>/experience 90%  [█████████ ]</div>
          </div>
        );
        break;

      case 'history':
        output = (
          <div className="text-cyan-400">
            <p className="text-yellow-400 mb-2">Command History:</p>
            {commandHistory.slice(-10).map((cmd, index) => (
              <div key={index} className="text-gray-300">
                {index + 1}  {cmd}
              </div>
            ))}
          </div>
        );
        break;

      case 'git':
        output = (
          <div className="text-cyan-400">
            <p className="text-yellow-400 mb-2">Git Status:</p>
            <div className="text-green-400">On branch: main</div>
            <div>Your branch is up to date with 'origin/main'</div>
            <div className="mt-2">Recent commits:</div>
            <div className="ml-4 text-gray-300">• Added new portfolio features</div>
            <div className="ml-4 text-gray-300">• Enhanced terminal interface</div>
            <div className="ml-4 text-gray-300">• Improved responsive design</div>
          </div>
        );
        break;

      case 'npm':
        output = (
          <div className="text-cyan-400">
            <p className="text-yellow-400 mb-2">NPM Package Info:</p>
            <div>react: ^18.3.1</div>
            <div>typescript: ^5.0.0</div>
            <div>tailwindcss: ^3.4.0</div>
            <div>framer-motion: ^12.6.3</div>
            <div>supabase: ^2.50.0</div>
          </div>
        );
        break;

      case 'ping':
        output = (
          <div className="text-cyan-400">
            <p>PING portfolio.dev (127.0.0.1): 56 data bytes</p>
            <div className="text-green-400">64 bytes from 127.0.0.1: icmp_seq=1 time=0.1ms ✓</div>
            <div className="text-green-400">64 bytes from 127.0.0.1: icmp_seq=2 time=0.1ms ✓</div>
            <div className="text-green-400">64 bytes from 127.0.0.1: icmp_seq=3 time=0.1ms ✓</div>
          </div>
        );
        break;

      case 'echo':
        const echoText = input.split(' ').slice(1).join(' ') || 'Hello World!';
        output = (
          <div className="text-cyan-400">
            <p>{echoText}</p>
          </div>
        );
        break;

      case 'cat':
        const filename = input.split(' ')[1];
        if (filename === 'about.md') {
          output = (
            <div className="text-cyan-400">
              <p className="text-yellow-400"># About {data.user.name}</p>
              <p className="mt-2">{data.user.bio}</p>
              <p className="mt-2">**Role:** {data.user.title}</p>
              <p>**Location:** {data.user.location}</p>
            </div>
          );
        } else {
          output = (
            <div className="text-red-400">
              <p>cat: {filename || '[filename]'}: No such file or directory</p>
            </div>
          );
        }
        break;

      case 'timeline':
      case 'experience':
        output = (
          <div className="text-cyan-400">
            <p className="text-yellow-400 mb-2">Career Timeline:</p>
            <div className="space-y-3">
              <div className="border-l-2 border-green-400 pl-3">
                <p className="text-green-400 font-semibold">Senior Full Stack Developer</p>
                <p className="text-gray-300 text-sm">2022 - Present</p>
                <p className="text-gray-300 text-sm">Leading development of scalable web applications</p>
              </div>
              <div className="border-l-2 border-blue-400 pl-3">
                <p className="text-blue-400 font-semibold">Full Stack Developer</p>
                <p className="text-gray-300 text-sm">2020 - 2022</p>
                <p className="text-gray-300 text-sm">Built modern web solutions using React and Node.js</p>
              </div>
            </div>
          </div>
        );
        break;

      case 'sudo':
        output = (
          <div className="text-red-400">
            <p>[sudo] password for {data.user.name?.toLowerCase().replace(' ', '_')}:</p>
            <p className="text-yellow-400">Access Denied: This is a portfolio, not a production server! 😄</p>
          </div>
        );
        break;

      case 'exit':
        output = (
          <div className="text-yellow-400">
            <p>Thanks for exploring my portfolio terminal!</p>
            <p>Type any command to continue...</p>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        return;

      default:
        output = (
          <div className="text-red-400">
            <p>Command not found: '{command}'</p>
            <p className="text-gray-400">Type 'help' to see available commands.</p>
          </div>
        );
    }

    setHistory(prev => [...prev, { command: cmd, output, timestamp }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (input.trim()) {
        executeCommand(input);
        setInput('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="w-full max-w-2xl bg-gray-900/95 backdrop-blur-xl border border-green-400/30 rounded-xl p-4 sm:p-6 font-mono shadow-2xl cursor-pointer mx-auto"
      onClick={handleTerminalClick}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <Terminal className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 text-sm">~/portfolio</span>
        </div>
        <div className="ml-auto text-xs text-gray-500">
          Interactive Terminal
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="h-72 lg:h-80 xl:h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 rounded-lg bg-black/20 p-2"
      >
        {!isActive ? (
          <div className="text-green-400 text-sm flex items-center justify-center h-full">
            <div className="text-center">
              <Terminal className="w-8 h-8 mx-auto mb-2 animate-pulse" />
              <p>Click to activate terminal</p>
              <p className="text-gray-500 text-xs mt-1">Interactive portfolio explorer</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {history.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm"
                >
                  {entry.command !== 'system' && (
                    <div className="flex items-center gap-2 text-green-400">
                      <span className="text-blue-400">$</span>
                      <span>{entry.command}</span>
                      <span className="text-gray-500 text-xs ml-auto">{entry.timestamp}</span>
                    </div>
                  )}
                  <div className="mb-3">{entry.output}</div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Input Line */}
            <div className="flex items-center gap-2 text-green-400">
              <span className="text-blue-400">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none flex-1 text-green-400 font-mono"
                placeholder="Type 'help' for commands..."
                autoComplete="off"
              />
              <ChevronRight className="w-4 h-4 text-green-400 animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default InteractiveTerminal;