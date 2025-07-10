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
    help: 'Show all available commands',
    about: 'Display about information',
    skills: 'Show technical skills',
    projects: 'List all projects',
    experience: 'Show work experience',
    education: 'Display education background',
    contact: 'Show contact information',
    social: 'Display social media links',
    certifications: 'List certifications',
    clear: 'Clear terminal',
    whoami: 'Display user information'
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
      className="bg-gray-900/90 backdrop-blur-xl border border-green-400/30 rounded-xl p-4 font-mono shadow-2xl cursor-pointer"
      onClick={handleTerminalClick}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <Terminal className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 text-sm">~/portfolio</span>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
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