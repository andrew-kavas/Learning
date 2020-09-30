
  STARTING
Menu --> Julia --> Start Julia
...julia start...
Menu --> Julia --> Open Terminal
cd("Code/Julia")

  RUNNING
to run a script from Julia terminal:
cd("PATH/TO")
include("my_script.jl")

  COMMANDS
pwd() = print working directory path
-h, --help	Print this message
-v, --version	Display version information
-H, --home <dir>	Set location of julia executable
-E, --print <expr>	Evaluate <expr> and display the result
-L, --load <file>	Load <file> immediately on all processors
-p, --procs {N|auto}	Integer value N launches N additional local worker processes; auto launches as many workers as the number of local CPU threads (logical cores)
--machine-file <file>	Run processes on hosts listed in <file>
-i	Interactive mode; REPL runs and isinteractive() is true
