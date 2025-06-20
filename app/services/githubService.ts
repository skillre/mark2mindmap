import { Octokit } from '@octokit/rest';

// 环境变量配置
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const MINDMAPS_PATH = 'mindmaps'; // 在GitHub仓库中存储思维导图的路径

// 初始化Octokit
const octokit = GITHUB_TOKEN ? new Octokit({
  auth: GITHUB_TOKEN
}) : null;

/**
 * GitHub存储结果接口
 */
interface GitHubStorageResult {
  success: boolean;
  filename: string;
  rawUrl: string;
  pagesUrl: string | null;
  githubUrl?: string;
}

/**
 * 将思维导图HTML文件保存到GitHub仓库
 * @param filename 文件名
 * @param content 文件内容
 * @returns 文件URL和相关信息
 */
export async function saveToGitHub(filename: string, content: string): Promise<GitHubStorageResult> {
  try {
    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO || !octokit) {
      throw new Error('GitHub配置不完整，请检查环境变量');
    }

    // 构建文件路径
    const filePath = `${MINDMAPS_PATH}/${filename}`;
    
    // Base64编码文件内容
    const contentEncoded = Buffer.from(content).toString('base64');
    
    // 检查文件是否已存在
    let sha: string | undefined;
    try {
      const { data: existingFile } = await octokit.rest.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: filePath,
        ref: GITHUB_BRANCH
      });
      
      if (!Array.isArray(existingFile) && 'sha' in existingFile) {
        sha = existingFile.sha;
      }
    } catch (error) {
      // 文件不存在，忽略错误
    }

    // 创建或更新文件
    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      message: `Add mindmap: ${filename}`,
      content: contentEncoded,
      branch: GITHUB_BRANCH,
      sha: sha
    });

    // 构建原始文件URL (用于直接访问HTML内容)
    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${filePath}`;
    
    // 构建GitHub页面URL (如果启用了GitHub Pages)
    const pagesUrl = process.env.GITHUB_PAGES_URL 
      ? `${process.env.GITHUB_PAGES_URL}/${filePath}` 
      : null;

    return {
      success: true,
      filename,
      rawUrl,
      pagesUrl,
      githubUrl: response.data.content?.html_url
    };
  } catch (error) {
    console.error('保存到GitHub时出错:', error);
    throw error;
  }
}

/**
 * 从GitHub获取思维导图HTML文件内容
 * @param filename 文件名
 * @returns 文件内容
 */
export async function getFromGitHub(filename: string): Promise<string> {
  try {
    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO || !octokit) {
      throw new Error('GitHub配置不完整，请检查环境变量');
    }

    // 构建文件路径
    const filePath = `${MINDMAPS_PATH}/${filename}`;
    
    // 获取文件内容
    const { data } = await octokit.rest.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      ref: GITHUB_BRANCH
    });
    
    // 确保返回的是文件内容而不是目录列表
    if (Array.isArray(data) || !('content' in data)) {
      throw new Error('无法获取文件内容');
    }

    // 解码Base64内容
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    
    return content;
  } catch (error) {
    console.error('从GitHub获取文件时出错:', error);
    throw error;
  }
} 