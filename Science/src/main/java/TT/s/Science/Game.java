package TT.s.Science;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

public class Game {
    public GameState game;
    public HashMap<Integer, Skup> eqBoards;
    public HashMap<Integer, HashSet<Integer>> children;

    public Game(){
        this.game = new GameState();
        this.game.numOfChildren = 8;
        this.game.next = null;
        for(int i = 0; i < 3; i++){
            for(int j = 0; j < 3; j++){
                this.game.board[i][j] = fieldState.EMPTY;
            }
        }
        this.game.buildTree(fieldState.CROS, 0);
        this.eqBoards = new HashMap<>();
        fillMaps();
        this.children = new HashMap<>();
        fillChildren();
    }

    public void fillMaps(){
        ArrayList<GameState> queue = new ArrayList<>();
        queue.add(this.game);
        while(!queue.isEmpty()){
            GameState curr = queue.remove(0);
            if(curr.next != null){
                for (GameState s : curr.next) {
                    queue.addLast(s);
                }
            }
            boolean alreadyExists = false;
            int indx = 0;
            if(!curr.checkWin() && curr.next != null) {
                for (Integer key : this.eqBoards.keySet()) {
                    indx = key;
                    if (this.eqBoards.get(key).contains(curr.board)) {
                        alreadyExists = true;
                        break;
                    }
                }
                if (!alreadyExists) this.eqBoards.put(indx + 1, curr.equalStates());
            }
        }
    }

    public void fillChildren(){
        ArrayList<GameState> queue = new ArrayList<>();
        queue.add(this.game);
        while(!queue.isEmpty()){
            GameState curr = queue.remove(0);
            if(curr.next != null){
                for (GameState s : curr.next) {
                    queue.addLast(s);
                }
            }
            for(Integer i : eqBoards.keySet()){
                if(eqBoards.get(i).contains(curr.board)){
                    if(!this.children.keySet().contains(i)){
                        this.children.put(i, new HashSet<>());
                        for(GameState gs : curr.next){
                            for(Integer j : eqBoards.keySet()){
                                if(eqBoards.get(j).contains(gs.board)) this.children.get(i).add(j);
                            }
                        }
                    }else{
                        for(GameState gs : curr.next){
                            for(Integer j : eqBoards.keySet()){
                                if(eqBoards.get(j).contains(gs.board)) this.children.get(i).add(j);
                            }
                        }
                    }
                }
            }
        }
    }
}
