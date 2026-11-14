using System;
using System.IO;
using System.Reflection;
using System.Windows.Forms;
using System.Drawing;
using System.Diagnostics;
using Microsoft.Win32;
class InstallAssistant : Form {
 readonly ComboBox browsers=new ComboBox();
 readonly TextBox folder=new TextBox();
 readonly Label status=new Label();
 readonly string destination=Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),"SuixinLesson","Extension");
 public InstallAssistant(){
  Text="随心听课 · 安装助手"; ClientSize=new Size(690,580); Font=new Font("Microsoft YaHei UI",10); BackColor=Color.FromArgb(244,249,246); MaximizeBox=false; FormBorderStyle=FormBorderStyle.FixedDialog; StartPosition=FormStartPosition.CenterScreen;
  Label title=new Label{Text="随心听课",Left=26,Top=20,Width=620,Height=42,Font=new Font("Microsoft YaHei UI",24,FontStyle.Bold),ForeColor=Color.FromArgb(23,107,73)};
  Label subtitle=new Label{Text="选好浏览器，点一下准备，然后照着下面 3 步完成。",Left=28,Top=73,Width=630,Height=28};
  browsers.SetBounds(28,114,180,32);browsers.DropDownStyle=ComboBoxStyle.DropDownList;browsers.Items.AddRange(new object[]{"Tabbit","Microsoft Edge","Google Chrome"});browsers.SelectedIndex=0;
  Button prepare=new Button{Text="准备文件并打开安装页",Left=220,Top=111,Width=260,Height=38};prepare.Click+=delegate{Prepare();};
  folder.SetBounds(28,164,620,30);folder.ReadOnly=true;folder.Text=destination;
  Button copy=new Button{Text="复制路径",Left=495,Top=111,Width=153,Height=38};copy.Click+=delegate{try{Clipboard.SetText(destination);status.Text="路径已复制，在文件夹选择窗口中按 Ctrl + V。";}catch(Exception e){status.Text=e.Message;}};
  Label steps=new Label{Left=28,Top=222,Width=625,Height=180,Text="① 右上角：打开「开发者模式」\n\n② 左上角：点「加载未打包的扩展程序」\n    有些浏览器叫「加载已解压的扩展程序」\n\n③ 弹出窗口：在底部「文件夹」框按 Ctrl + V\n    然后点「选择文件夹」"};
  status.SetBounds(28,416,620,60);status.ForeColor=Color.FromArgb(23,107,73);status.Text="首次安装从上方按钮开始。不需要管理员权限。";
  Label finish=new Label{Left=28,Top=488,Width=620,Height=66,Font=new Font("Microsoft YaHei UI",9),Text="安装完成后：刷新学习通课程页，手动播放视频。\n已安装旧版？请先在原扩展卡片点「重新加载」；不要同时加载两份。\n助手只准备文件，最后的加载操作需要在浏览器中完成。"};
  Controls.AddRange(new Control[]{title,subtitle,browsers,prepare,copy,folder,steps,status,finish});
 }
 string FindBrowser(){
  string exe=browsers.SelectedIndex==0?"tabbit.exe":browsers.SelectedIndex==1?"msedge.exe":"chrome.exe";
  foreach(Process p in Process.GetProcessesByName(Path.GetFileNameWithoutExtension(exe))){try{string s=p.MainModule.FileName;if(File.Exists(s))return s;}catch{}}
  foreach(RegistryKey root in new RegistryKey[]{Registry.CurrentUser,Registry.LocalMachine}){using(RegistryKey k=root.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\App Paths\"+exe)){if(k!=null){string s=k.GetValue(null) as string;if(s!=null&&File.Exists(s.Trim('"')))return s.Trim('"');}}}
  string sub=browsers.SelectedIndex==0?@"Tabbit\Application\tabbit.exe":browsers.SelectedIndex==1?@"Microsoft\Edge\Application\msedge.exe":@"Google\Chrome\Application\chrome.exe";
  foreach(string root in new string[]{Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles),Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86)}){string s=Path.Combine(root,sub);if(File.Exists(s))return s;}
  using(OpenFileDialog d=new OpenFileDialog{Title="请选择用于听课的浏览器程序",Filter="浏览器程序 (*.exe)|*.exe",FileName=exe}){return d.ShowDialog()==DialogResult.OK?d.FileName:null;}
 }
 void Prepare(){try{
  string browser=FindBrowser();if(browser==null){status.Text="尚未选择浏览器。你也可以手动打开扩展管理页。";return;}
  Directory.CreateDirectory(destination);
  Assembly a=Assembly.GetExecutingAssembly();int count=0;
  foreach(string name in a.GetManifestResourceNames()){
   if(!name.StartsWith("payload/"))continue;
   string rel=name.Substring(8);if(rel.Contains("..")||Path.IsPathRooted(rel))throw new IOException("安装包路径无效");
   string target=Path.Combine(destination,rel.Replace('/',Path.DirectorySeparatorChar));Directory.CreateDirectory(Path.GetDirectoryName(target));
   using(Stream src=a.GetManifestResourceStream(name))using(FileStream dst=File.Create(target))src.CopyTo(dst);count++;
  }
  if(count==0||!File.Exists(Path.Combine(destination,"manifest.json")))throw new IOException("插件文件不完整");
  Clipboard.SetText(destination);
  string url=browsers.SelectedIndex==1?"edge://extensions":"chrome://extensions";
  Process.Start(new ProcessStartInfo(browser,url){UseShellExecute=true});
  status.Text="文件已准备，路径已复制，安装页已打开。\n现在按上面的 ① ② ③ 完成加载；需要路径时可再点「复制路径」。";
 }catch(Exception e){status.Text="准备未完成："+e.Message;}}
 [STAThread] static void Main(){Application.EnableVisualStyles();Application.SetCompatibleTextRenderingDefault(false);Application.Run(new InstallAssistant());}
}
